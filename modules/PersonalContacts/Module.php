<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\PersonalContacts;

use Afterlogic\DAV\Backend;
use Afterlogic\DAV\Constants;
use Aurora\Api;
use Aurora\Modules\Contacts\Enums\StorageType;
use Aurora\Modules\Contacts\Classes\Contact;
use Aurora\Modules\Contacts\Module as ContactsModule;
use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractModule
{
    public static $sStorage = StorageType::Personal;
    protected static $iStorageOrder = 0;

    protected $storagesMapToAddressbooks = [
        StorageType::Personal => Constants::ADDRESSBOOK_DEFAULT_NAME,
        StorageType::Collected => Constants::ADDRESSBOOK_COLLECTED_NAME,
    ];

    public function init()
    {
        $this->subscribeEvent('Core::CreateUser::after', array($this, 'onAfterCreateUser'));
        $this->subscribeEvent('Contacts::CreateContact::before', array($this, 'onBeforeCreateContact'));
        $this->subscribeEvent('Contacts::PrepareFiltersFromStorage', array($this, 'onPrepareFiltersFromStorage'));
        $this->subscribeEvent('Mail::ExtendMessageData', array($this, 'onExtendMessageData'));
        $this->subscribeEvent('Contacts::CheckAccessToObject::after', array($this, 'onAfterCheckAccessToObject'));
        $this->subscribeEvent('Contacts::GetContactSuggestions', array($this, 'onGetContactSuggestions'));

        $this->subscribeEvent('Contacts::GetAddressBooks::after', array($this, 'onAfterGetAddressBooks'));
        $this->subscribeEvent('Contacts::ContactQueryBuilder', array($this, 'onContactQueryBuilder'));
        $this->subscribeEvent('Contacts::DeleteContacts::before', array($this, 'onBeforeDeleteContacts'));
        $this->subscribeEvent('Contacts::CheckAccessToAddressBook::after', array($this, 'onAfterCheckAccessToAddressBook'), 90);
        $this->subscribeEvent('Contacts::GetStoragesMapToAddressbooks::after', array($this, 'onAfterGetStoragesMapToAddressbooks'));
        $this->subscribeEvent('Contacts::GetContacts::before', array($this, 'populateContactArguments'));
        $this->subscribeEvent('Contacts::GetContactsByEmails::before', array($this, 'populateContactArguments'));
        $this->subscribeEvent('Contacts::PopulateContactArguments', array($this, 'populateContactArguments'));
        $this->subscribeEvent('Contacts::Export::before', array($this, 'populateContactArguments'));
    }

    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    public function onAfterCreateUser($aArgs, &$mResult)
    {
        if ($mResult) {
            $principalUri = Constants::PRINCIPALS_PREFIX . $aArgs['PublicId'];

            Backend::Carddav()->createAddressBook(
                $principalUri,
                Constants::ADDRESSBOOK_DEFAULT_NAME,
                [
                    '{DAV:}displayname' => Constants::ADDRESSBOOK_DEFAULT_DISPLAY_NAME
                ]
            );

            Backend::Carddav()->createAddressBook(
                $principalUri,
                Constants::ADDRESSBOOK_COLLECTED_NAME,
                [
                    '{DAV:}displayname' => Constants::ADDRESSBOOK_COLLECTED_DISPLAY_NAME
                ]
            );
        }
    }

    public function onBeforeCreateContact(&$aArgs, &$mResult)
    {
        if (isset($aArgs['Contact'])) {
            if (isset($aArgs['UserId'])) {
                $aArgs['Contact']['UserId'] = $aArgs['UserId'];
            }
            $this->populateContactArguments($aArgs['Contact'], $mResult);
        }
    }

    public function onBeforeDeleteContacts(&$aArgs, &$mResult)
    {
        $this->populateContactArguments($aArgs, $mResult);
        if (isset($aArgs['AddressBookId'])) {
            $aArgs['Storage'] = $aArgs['AddressBookId'];
        }
    }

    public function onPrepareFiltersFromStorage(&$aArgs, &$mResult)
    {
        if (isset($aArgs['Storage'])) {
            if ($aArgs['Storage'] === StorageType::All) {
                $oUser = Api::getUserById($aArgs['UserId']);
                if ($oUser) {
                    $aArgs['IsValid'] = true;
                    $ids = Capsule::connection()->table('adav_addressbooks')
                        ->select('id')
                        ->where('principaluri', Constants::PRINCIPALS_PREFIX . $oUser->PublicId)
                        ->pluck('id')->toArray();
                    if ($ids) {
                        $mResult->orWhere(function ($q) use ($ids, $aArgs) {
                            $q->whereIn('adav_cards.addressbookid', $ids);
                            if ((isset($aArgs['Suggestions']) && !$aArgs['Suggestions']) || !isset($aArgs['Suggestions'])) {
                                $q->where('adav_addressbooks.uri', '!=', Constants::ADDRESSBOOK_COLLECTED_NAME);
                            }
                        });
                    }
                }
            } elseif (isset($aArgs['AddressBookId'])) {
                $aArgs['IsValid'] = true;
                $mResult->orWhere('adav_cards.addressbookid', (int) $aArgs['AddressBookId']);
            }
            if (isset($aArgs['Query'])) {
                $aArgs['Query']->join('adav_addressbooks', 'adav_addressbooks.id', '=', 'adav_cards.addressbookid');
                $aArgs['Query']->addSelect(Capsule::connection()->raw(
                    '
                CASE
                    WHEN ' . Capsule::connection()->getTablePrefix() . 'adav_addressbooks.uri = \'' . Constants::ADDRESSBOOK_COLLECTED_NAME . '\' THEN true
                    ELSE false
                END as Auto'
                ));
            }
        }
    }

    public function onExtendMessageData($aData, &$oMessage)
    {
        $oApiFileCache = new \Aurora\System\Managers\Filecache();

        $oUser = Api::getAuthenticatedUser();

        foreach ($aData as $aDataItem) {
            $oPart = $aDataItem['Part'];
            $bVcard = $oPart instanceof \MailSo\Imap\BodyStructure &&
                    ($oPart->ContentType() === 'text/vcard' || $oPart->ContentType() === 'text/x-vcard');
            $sData = $aDataItem['Data'];
            if ($bVcard && !empty($sData)) {
                $oContact = new Contact();
                try {
                    $oContact->InitFromVCardStr($oUser->Id, $sData);

                    $oContact->UUID = '';

                    $bContactExists = false;
                    if (0 < strlen($oContact->ViewEmail)) {
                        $aLocalContacts = ContactsModule::Decorator()->GetContactsByEmails(
                            $oUser->Id,
                            self::$sStorage,
                            [$oContact->ViewEmail]
                        );
                        $oLocalContact = count($aLocalContacts) > 0 ? $aLocalContacts[0] : null;
                        if ($oLocalContact) {
                            $oContact->UUID = $oLocalContact->UUID;
                            $bContactExists = true;
                        }
                    }

                    $sTemptFile = md5($sData) . '.vcf';
                    if ($oApiFileCache && $oApiFileCache->put($oUser->UUID, $sTemptFile, $sData)) { // Temp files with access from another module should be stored in System folder
                        if (class_exists('\Aurora\Modules\Mail\Classes\Vcard')) {
                            $oVcard = \Aurora\Modules\Mail\Classes\Vcard::createInstance();

                            $oVcard->Uid = $oContact->UUID;
                            $oVcard->File = $sTemptFile;
                            $oVcard->Exists = !!$bContactExists;
                            $oVcard->Name = $oContact->FullName;
                            $oVcard->Email = $oContact->ViewEmail;

                            $oMessage->addExtend('VCARD', $oVcard);
                        }
                    } else {
                        Api::Log('Can\'t save temp file "' . $sTemptFile . '"', \Aurora\System\Enums\LogLevel::Error);
                    }
                } catch(\Exception $oEx) {
                    Api::LogException($oEx);
                }
            }
        }
    }

    public function onAfterCheckAccessToObject(&$aArgs, &$mResult)
    {
        $oUser = $aArgs['User'];
        $oContact = isset($aArgs['Contact']) ? $aArgs['Contact'] : null;

        if ($oContact instanceof Contact && $oContact->Storage === self::$sStorage) {
            if ($oUser->Role !== \Aurora\System\Enums\UserRole::SuperAdmin && $oUser->Id !== $oContact->IdUser) {
                $mResult = false;
            } else {
                $mResult = true;
            }
        }
    }

    public function onGetContactSuggestions(&$aArgs, &$mResult)
    {
        if ($aArgs['Storage'] === 'all' || $aArgs['Storage'] === self::$sStorage) {
            $mResult['personal'] = ContactsModule::Decorator()->GetContacts(
                $aArgs['UserId'],
                self::$sStorage,
                0,
                $aArgs['Limit'],
                $aArgs['SortField'],
                $aArgs['SortOrder'],
                $aArgs['Search']
            );
        }
    }

    /**
     *
     */
    public function populateContactArguments(&$aArgs, &$mResult)
    {
        if (isset($aArgs['Storage'], $aArgs['UserId'])) {
            $aStorageParts = \explode('-', $aArgs['Storage']);
            if (count($aStorageParts) > 1) {
                $iAddressBookId = $aStorageParts[1];
                if ($aStorageParts[0] === StorageType::AddressBook) {
                    if (!is_numeric($iAddressBookId)) {
                        return;
                    }
                    $aArgs['Storage'] = $aStorageParts[0];
                    $aArgs['AddressBookId'] = $iAddressBookId;

                    $mResult = true;
                }
            } elseif (isset($aStorageParts[0])) {
                if (isset($this->storagesMapToAddressbooks[$aStorageParts[0]])) {
                    $addressbookUri = $this->storagesMapToAddressbooks[$aStorageParts[0]];
                    $userPublicId = Api::getUserPublicIdById($aArgs['UserId']);
                    if ($userPublicId) {
                        $row = Capsule::connection()->table('adav_addressbooks')
                            ->where('principaluri', Constants::PRINCIPALS_PREFIX . $userPublicId)
                            ->where('uri', $addressbookUri)
                            ->select('adav_addressbooks.id as addressbook_id')->first();
                        if ($row) {
                            $aArgs['AddressBookId'] = $row->addressbook_id;

                            $mResult = true;
                        }
                    }
                }
            }
        }
    }

    /**
     * @param array $addressBooks
     * @param string $principalUri
     * @return void
     */
    protected function createMissingAddressBooks(&$addressBooks, $principalUri)
    {
        $result = false;
        if (!collect($addressBooks)->where('uri', Constants::ADDRESSBOOK_DEFAULT_NAME)->first()) {
            $result = !!Backend::Carddav()->createAddressBook(
                $principalUri,
                Constants::ADDRESSBOOK_DEFAULT_NAME,
                [
                    '{DAV:}displayname' => Constants::ADDRESSBOOK_DEFAULT_DISPLAY_NAME
                ]
            );
        }

        if (!collect($addressBooks)->where('uri', Constants::ADDRESSBOOK_COLLECTED_NAME)->first()) {
            $cardId = Backend::Carddav()->createAddressBook(
                $principalUri,
                Constants::ADDRESSBOOK_COLLECTED_NAME,
                [
                    '{DAV:}displayname' => Constants::ADDRESSBOOK_COLLECTED_DISPLAY_NAME
                ]
            );
            if (!$result) {
                $result = !!$cardId;
            }
        }

        if ($result) {
            $addressBooks = Backend::Carddav()->getAddressBooksForUser($principalUri);
        }
    }

    /**
     *
     */
    public function onAfterGetAddressBooks(&$aArgs, &$mResult)
    {
        if (!is_array($mResult)) {
            $mResult = [];
        }

        $userPublicId = Api::getUserPublicIdById($aArgs['UserId']);
        $principalUri = Constants::PRINCIPALS_PREFIX . $userPublicId;
        $aAddressBooks = Backend::Carddav()->getAddressBooksForUser($principalUri);

        $this->createMissingAddressBooks($aAddressBooks, $principalUri);

        foreach ($aAddressBooks as $oAddressBook) {
            $storage = array_search($oAddressBook['uri'], $this->storagesMapToAddressbooks);
            /**
             * @var array $oAddressBook
             */
            $mResult[] = [
                'Id' => $storage ? $storage : StorageType::AddressBook . '-' . $oAddressBook['id'],
                'EntityId' => (int) $oAddressBook['id'],
                'CTag' => (int) $oAddressBook['{http://sabredav.org/ns}sync-token'],
                'Display' => $oAddressBook['uri'] !== Constants::ADDRESSBOOK_COLLECTED_NAME,
                'Owner' => basename($oAddressBook['principaluri']),
                'Order' => 1,
                'DisplayName' => $oAddressBook['{DAV:}displayname'],
                'Uri' => $oAddressBook['uri'],
                'Url' => 'addressbooks/' . $oAddressBook['uri'],
            ];
        }
    }

    public function onContactQueryBuilder(&$aArgs, &$query)
    {
        $userPublicId = Api::getUserPublicIdById($aArgs['UserId']);
        $query->orWhere(function ($q) use ($userPublicId, $aArgs) {
            $q->where('adav_addressbooks.principaluri', Constants::PRINCIPALS_PREFIX . $userPublicId);
            if (is_array($aArgs['UUID'])) {
                $ids = $aArgs['UUID'];
                if (count($aArgs['UUID']) === 0) {
                    $ids = [null];
                }
                $q->whereIn('adav_cards.id', $ids);
            } else {
                $q->where('adav_cards.id', $aArgs['UUID']);
            }
        });
    }

    public function onAfterCheckAccessToAddressBook(&$aArgs, &$mResult)
    {
        if (isset($aArgs['User'], $aArgs['AddressBookId'])) {
            $mResult = !!Capsule::connection()->table('adav_addressbooks')
                ->where('principaluri', Constants::PRINCIPALS_PREFIX . $aArgs['User']->PublicId)
                ->where('id', $aArgs['AddressBookId'])
                ->first();
            if ($mResult) {
                return true;
            }
        }
    }

    public function onAfterGetStoragesMapToAddressbooks(&$aArgs, &$mResult)
    {
        $mResult = array_merge($mResult, $this->storagesMapToAddressbooks);
    }
}
