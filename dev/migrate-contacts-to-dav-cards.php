<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\Calendar;

use Afterlogic\DAV\Constants;
use Aurora\Modules\Contacts\Classes\Contact;
use Aurora\Modules\Contacts\Enums\StorageType;
use Aurora\Modules\Contacts\Models\ContactCard;
use Aurora\Modules\Core\Module as CoreModule;
use Aurora\Modules\Contacts\Module as ContactsModule;
use Aurora\System\Api;
use Illuminate\Database\Capsule\Manager as Capsule;

if (PHP_SAPI !== 'cli') {
    exit("Use the console for running this script");
}

require_once \dirname(__file__) . "/../system/autoload.php";
Api::Init(true);

class MigrationContact extends Contact
{
    public function getExtendedProp($prop)
    {
        $result = null;

        if (isset($this->Properties[$prop])) {
            $result = $this->Properties[$prop];
        }

        return $result;
    }

    public function setExtendedProp($prop, $value)
    {
        $this->Properties[$prop] = $value;
    }

    public function populate($Contact)
    {
        parent::populate($Contact);
        if (is_string($this->Properties)) {
            $this->Properties = \json_decode($this->Properties, true);
        }
        $uid = $this->getExtendedProp('DavContacts::VCardUID');
        if (!isset($uid)) {
            $this->setExtendedProp('DavContacts::VCardUID', $this->UUID);
        }
    }
}

class Helper
{
    public static $InitialisedUserId = null;
    public static $Principal = null;

    public static function getStorage($sStorage)
    {
        $sResult = Constants::ADDRESSBOOK_DEFAULT_NAME;
        if ($sStorage === StorageType::Personal) {
            $sResult = Constants::ADDRESSBOOK_DEFAULT_NAME;
        } elseif ($sStorage === StorageType::Shared) {
            $sResult = Constants::ADDRESSBOOK_SHARED_WITH_ALL_NAME;
        } elseif ($sStorage === StorageType::Collected) {
            $sResult = Constants::ADDRESSBOOK_COLLECTED_NAME;
        } elseif ($sStorage === StorageType::Team) {
            $sResult = 'gab';
        }

        return $sResult;
    }

    /**
    * @param int $iUserId
    */
    public static function init($iUserId)
    {
        $bInitialized = false;
        if (self::$InitialisedUserId !== $iUserId) {
            $oUser = \Aurora\Api::getUserById($iUserId);
            self::$InitialisedUserId = $iUserId;
            if ($oUser) {
                $aPrincipalProperties = \Afterlogic\DAV\Backend::Principal()->getPrincipalByPath(Constants::PRINCIPALS_PREFIX . $oUser->PublicId);
                if ($aPrincipalProperties) {
                    if (isset($aPrincipalProperties['uri'])) {
                        self::$Principal = $aPrincipalProperties['uri'];
                    }
                }
                $bInitialized = true;
            }
        } else {
            $bInitialized = true;
        }

        return $bInitialized;
    }

    public static function getAddressBook($iUserId, $sName)
    {
        $oAddressBook = false;
        if (self::init($iUserId)) {
            $oUserAddressBooks = new \Afterlogic\DAV\CardDAV\AddressBookRoot(
                \Afterlogic\DAV\Backend::Carddav(),
                self::$Principal
            );

            if ($oUserAddressBooks->childExists($sName)) {
                $oAddressBook = $oUserAddressBooks->getChild($sName);
            }
        }

        return $oAddressBook;
    }

    public static function getDBAddressBook($UserId, $AddressBookId)
    {
        return Capsule::connection()->table('contacts_addressbooks')
            ->where('Id', $AddressBookId)
            ->where('UserId', $UserId)
            ->first();
    }

    public static function getCard($oAddressBook, $sId)
    {
        $bResult = false;
        if ($oAddressBook) {
            if ($oAddressBook->childExists($sId)) {
                $bResult = $oAddressBook->getChild($sId);
            }
        }
        return $bResult;
    }

    public static function getDavContactById($iUserId, $sAddressBookName, $mContactId)
    {
        $oContact = false;
        if (self::init($iUserId)) {
            $oAddressBook = self::getAddressBook($iUserId, $sAddressBookName);
            $oContactItem = self::getCard($oAddressBook, $mContactId . '.vcf');

            if ($oContactItem) {
                $sVCardData = $oContactItem->get();
                if ($sVCardData) {
                    $oContact = new MigrationContact();
                    $oContact->InitFromVCardStr($iUserId, $sVCardData);
                    $oContact->ETag = trim($oContactItem->getETag(), '"');
                }
            }

            return $oContact;
        }
    }

    public static function updateContactCardProperties($oCard, $oContact)
    {
        $result = false;

        $cardData = \Closure::bind(
            function ($oCard) {
                return $oCard->cardData;
            },
            null,
            \Sabre\CardDAV\Card::class
        )($oCard);
        if ($cardData) {
            $properties = null;
            if ($oContact && isset($oContact->Properties)) {
                $properties = $oContact->Properties;
                if (isset($properties['DavContacts::UID'])) {
                    unset($properties['DavContacts::UID']);
                }
                if (isset($properties['DavContacts::VCardUID'])) {
                    unset($properties['DavContacts::VCardUID']);
                }
            }

            if (isset($properties) && is_array($properties) && count($properties) > 0) {
                $result = !!ContactCard::where('CardId', $cardData['id'])->update(['Properties' => \json_encode($properties)]);
            }
        }

        return $result;
    }

    public static function updateDavContact($oContact)
    {
        $bResult = false;

        $oAddressBook = null;
        if ($oContact->Storage === StorageType::Personal) {
            $oAddressBook = self::getAddressBook($oContact->IdUser, Constants::ADDRESSBOOK_DEFAULT_NAME);
        } elseif ($oContact->Storage === StorageType::Shared) {
            $oAddressBook = self::getAddressBook($oContact->IdUser, Constants::ADDRESSBOOK_SHARED_WITH_ALL_NAME);
        } elseif ($oContact->Storage === StorageType::Team) {
            $bResult = true;
        } elseif ($oContact->Storage === StorageType::AddressBook) {

            $oAddressBook = self::getDBAddressBook($oContact->IdUser, $oContact->IdUser);

            if ($oAddressBook) {
                $oAddressBook = self::getAddressBook($oContact->IdUser, $oAddressBook->UUID);
            }
        }

        $sDavContactsUID = $oContact->UUID;
        if ($sDavContactsUID) {
            $oContactItem = $oAddressBook ? self::getCard($oAddressBook, $sDavContactsUID . '.vcf') : null;

            if ($oContactItem) {
                $sData = $oContactItem->get();

                $oVCard = \Sabre\VObject\Reader::read($sData);
                if ($oVCard) {
                    \Aurora\Modules\Contacts\Classes\VCard\Helper::UpdateVCardFromContact($oContact, $oVCard);
                    $oContactItem->put($oVCard->serialize());

                    self::updateContactCardProperties($oContactItem, $oContact);

                    $bResult = true;
                }
                unset($oVCard);
            }
        }

        return $bResult;
    }

    public static function createDavContact($oContact)
    {
        $bResult = false;
        if ($oContact) {
            self::init($oContact->IdUser);
            $oAddressBook = null;
            if ($oContact->Storage === StorageType::Personal) {
                if (!$oContact->Auto) {
                    $oAddressBook = self::getAddressBook($oContact->IdUser, Constants::ADDRESSBOOK_DEFAULT_NAME);
                } else {
                    $oAddressBook = self::getAddressBook($oContact->IdUser, Constants::ADDRESSBOOK_COLLECTED_NAME);
                }
            } elseif ($oContact->Storage === StorageType::Shared) {
                $oAddressBook = self::getAddressBook($oContact->IdUser, Constants::ADDRESSBOOK_SHARED_WITH_ALL_NAME);
            } elseif ($oContact->Storage === StorageType::AddressBook) {

                $oAddressBook = self::getDBAddressBook($oContact->IdUser, $oContact->AddressBookId);

                if ($oAddressBook) {
                    $oAddressBook = self::getAddressBook($oContact->IdUser, $oAddressBook->UUID);
                }
            }
            if ($oAddressBook) {
                $sDavContactsUID = $oContact->UUID . '.vcf';

                $oVCard = new \Sabre\VObject\Component\VCard();
                \Aurora\Modules\Contacts\Classes\VCard\Helper::UpdateVCardFromContact($oContact, $oVCard);
                $oAddressBook->createFile($sDavContactsUID, $oVCard->serialize());

                $oContactItem = self::getCard($oAddressBook, $sDavContactsUID);
                if ($oContactItem) {
                    self::updateContactCardProperties($oContactItem, $oContact);
                }

                $bResult = true;
            }
        }

        return $bResult;
    }

    public static function getContactsIdsFromUUIDs($UserId, $UUIDs)
    {
        $Uris = array_map(function ($item) {
            return $item . '.vcf';
        }, $UUIDs);

        $contactsIds = Capsule::connection()->table('adav_cards')
            ->join('adav_addressbooks', 'adav_cards.addressbookid', '=', 'adav_addressbooks.id')
            ->select('adav_cards.id as card_id')
            ->where('principaluri', Constants::PRINCIPALS_PREFIX . Api::getUserPublicIdById($UserId))
            ->whereIn('adav_cards.uri', $Uris)->get()->all();

        return array_map(function ($item) {
            return $item->card_id;
        }, $contactsIds);
    }

    public static function log($message)
    {
        Api::Log($message, \Aurora\System\Enums\LogLevel::Error, 'contacts-migration-');
    }
}

function UpdateContact($aContact)
{
    Helper::log('Process contact: ' . $aContact['UUID']);
    if (is_array($aContact)) {

        $Contact = new MigrationContact();
        $Contact->populate($aContact);

        $UserId = $Contact->IdUser;
        $sContactStorage = $Contact->Storage;
        if ($sContactStorage === StorageType::Personal && isset($Contact->Auto) && $Contact->Auto === true) {
            $sContactStorage = StorageType::Collected;
        }
        $sStorage = Helper::getStorage($sContactStorage);

        $aStorageParts = \explode('-', $sContactStorage);
        if (isset($aStorageParts[0]) && $aStorageParts[0] === StorageType::AddressBook) {
            $oAddressBook = Helper::getDBAddressBook($Contact->IdUser, $Contact->IdUser);
            if ($oAddressBook) {
                $sStorage =  $oAddressBook->UUID;
            } else {
                $sUserPrincipalUri = Constants::PRINCIPALS_PREFIX . Api::getUserPublicIdById($UserId);
                $dBPrefix = Api::GetSettings()->DBPrefix;
                $stmt = Api::GetPDO()->prepare("select sa.* from " . $dBPrefix . "adav_shared_addressbooks sa 
                left join " . $dBPrefix . "adav_addressbooks da on sa.addressbook_id = da.id 
                right join " . $dBPrefix . "contacts_addressbooks ca on da.uri = ca.UUID where ca.Id = ? and sa.principaluri = ?");
                $stmt->execute([$Contact->AddressBookId, $sUserPrincipalUri]);
                $res = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                if (is_array($res) && count($res) > 0) {
                    $sStorage = $res[0]['addressbookuri'];
                }
            }
        }
        $oDavContact = Helper::getDavContactById(
            $UserId,
            $sStorage,
            $Contact->UUID
        );

        if ($oDavContact) {
            Helper::log('Contact is already exists: ' . $Contact->UUID);
            // $aStorageParts = \explode('-', $Contact->Storage);
            // if (isset($aStorageParts[0]) && $aStorageParts[0] === StorageType::AddressBook) {
            //     $Contact->Storage = StorageType::AddressBook;
            // }
            // if (Helper::updateDavContact($Contact)) {
            //     Helper::log('Contact updated successfully: ' . $Contact->UUID);
            // }
        } else {
            if (Helper::createDavContact($Contact)) {
                Helper::log('Contact created successfully: ' . $Contact->UUID);
            }
        }
    }
}

$usersCount = -1;

$offset = 0;
$limit = 100;
while ($offset < $usersCount || $usersCount === -1) {

    // getting users list
    $result = CoreModule::Decorator()->GetUsers(0, $offset, $limit);

    if ($usersCount < 0) {
        Helper::log('Users count: ' . $result['Count']);
    }

    $usersCount = $result['Count'];
    $offset = $offset + $limit - 1;

    foreach ($result['Items'] as $user) {
        Helper::log('');
        Helper::log('===> Process user: ' . $user['Id']);
        // getting user contacts
        $contactsQuery = Capsule::connection()->table('contacts')->where('IdUser', $user['Id']);
        $contactsCount = $contactsQuery->count();
        Helper::log('Contacts count: ' . $contactsCount);

        $contactsOffset = 0;

        while ($contactsOffset < $contactsCount) {
            $contacts = $contactsQuery->offset($contactsOffset)->limit($limit)->get();

            foreach ($contacts as $contact) {
                $contact = json_decode(json_encode($contact), true);
                // update contact
                UpdateContact($contact);
            }
            $contactsOffset = $contactsOffset + $limit - 1;
        }

        // getting groups
        $groups = Capsule::connection()->table('contacts_groups')
            ->where('IdUser', $user['Id'])
            ->get();

        Helper::log('Groups count: ' . count($groups));

        foreach ($groups as $group) {
            $group = json_decode(json_encode($group), true);
            Helper::log('Process group: ' . $group['UUID']);
            $groupIds = Helper::getContactsIdsFromUUIDs($user['Id'], [$group['UUID']]);
            $DavGroup = false;
            if (isset($groupIds[0])) {
                $DavGroup = ContactsModule::Decorator()->GetGroup($user['Id'], $groupIds[0]);
            }
            // if the group does not exist
            if (!$DavGroup) {
                $groupContacts = Capsule::connection()->table('contacts_group_contact')
                    ->leftJoin('contacts', 'contacts.Id', '=', 'contacts_group_contact.ContactId')
                    ->where('contacts.IdUser', $user['Id'])
                    ->where('contacts_group_contact.GroupId', $group['Id'])
                    ->select('contacts.UUID as DavUid')
                    ->pluck('DavUid')->toArray();

                Helper::log('Group contacts count: ' . count($groupContacts));
                $group['Contacts'] = Helper::getContactsIdsFromUUIDs($user['Id'], $groupContacts);

                // creating the group
                if (!!ContactsModule::Decorator()->CreateGroup($group, $user['Id'])) {
                    Helper::log('Group created successfully: ' . $group['UUID']);
                } else {
                    Helper::log('An error occurred while creating the group: ' . $group['UUID']);
                }
            } else {
                Helper::log('Group already exists: ' . $group['UUID']);
            }
        }
    }
}
