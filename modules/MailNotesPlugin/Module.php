<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailNotesPlugin;

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
    public function init()
    {
        $this->subscribeEvent('Mail::GetFolders::before', array($this, 'onBeforeGetFolders'));
        $this->subscribeEvent('Mail::GetMessages::before', array($this, 'onBeforeGetMessages'));
        $this->subscribeEvent('Mail::GetMessages::after', array($this, 'onAfterGetMessages'));
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

    public function onBeforeGetFolders(&$aArgs, &$mResult)
    {
        $oMailModule = \Aurora\Modules\Mail\Module::getInstance();
        $oApiAccountsManager = $oMailModule->getAccountsManager();
        $oApiMailManager = $oMailModule->getMailManager();

        $iAccountID = $aArgs['AccountID'];
        $oAccount = $oApiAccountsManager->getAccountById($iAccountID);
        if ($oAccount) {
            $oNamespace = $oApiMailManager->getFoldersNamespace($oAccount);
            $sNamespace = $oNamespace ? $oNamespace->GetPersonalNamespace() : '';
            $aResult = \Aurora\Modules\Mail\Module::Decorator()->GetRelevantFoldersInformation($iAccountID, array($sNamespace . 'Notes'), false);
            if (empty($aResult['Counts'])) {
                try {
                    \Aurora\Modules\Mail\Module::Decorator()->CreateFolder($iAccountID, $sNamespace . 'Notes', '', '/');
                } catch (\Exception $oException) {
                }
            }
        }
    }

    public function onBeforeGetMessages(&$aArgs, &$mResult)
    {
        if (isset($aArgs['Folder']) && $aArgs['Folder'] === 'Notes' && isset($aArgs['Search']) && !empty($aArgs['Search'])) {
            $aArgs['ActualSearch'] = $aArgs['Search'];
            $aArgs['Search'] = sprintf('text:%s', $aArgs['Search']);
        }
    }

    public function onAfterGetMessages(&$aArgs, &$mResult)
    {
        if (isset($aArgs['Folder']) && $aArgs['Folder'] === 'Notes' && isset($aArgs['ActualSearch'])) {
            $aArgs['Search'] = $aArgs['ActualSearch'];
            unset($aArgs['ActualSearch']);
            $mResult->Search = $aArgs['Search'];
        }
    }

    protected function populateFromOrigMessage($iAccountId, $FolderFullName, $MessageUid, &$oMessage)
    {
        $oOrigMessage = \Aurora\Modules\Mail\Module::Decorator()->GetMessage($iAccountId, $FolderFullName, $MessageUid);

        if ($oOrigMessage) {
            $oFromCollection = $oOrigMessage->getFrom();
            if ($oFromCollection && $oFromCollection->Count() > 0) {
                $oMessage->SetFrom($oFromCollection->GetByIndex(0));
            }
            $oToCollection = $oOrigMessage->getTo();
            if ($oToCollection && $oToCollection->Count() > 0) {
                $oMessage->SetTo($oToCollection);
            }
        }
    }

    /**
     * Creates or updates a note.
     *
     * @param int $AccountID
     * @param string $FolderFullName
     * @param string $Text
     * @param string $Subject
     * @param int $MessageUid
     *
     * @return int
     */
    public function SaveNote($AccountID, $FolderFullName, $Text, $Subject, $MessageUid = null)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
        /** @var \Aurora\Modules\Mail\Module $oMailModule */
        $oMailModule = \Aurora\System\Api::GetModule('Mail');
        $oApiAccountsManager = $oMailModule->getAccountsManager();
        $oAccount = $oApiAccountsManager->getAccountById($AccountID);

        $oAuthenticatedUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oAccount->IdUser !== $oAuthenticatedUser->Id) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied, null, 'AccessDenied');
        }

        $oApiMailManager = $oMailModule->getMailManager();
        $oMessage = \MailSo\Mime\Message::NewInstance();
        $oMessage->RegenerateMessageId();
        $oMessage->SetSubject($Subject);
        $oMessage->AddText($Text, true);
        $oMessage->SetCustomHeader('X-Uniform-Type-Identifier', 'com.apple.mail-note');
        $oMessage->SetCustomHeader('X-Universally-Unique-Identifier', uniqid());

        if (!empty($MessageUid)) {
            $this->populateFromOrigMessage($AccountID, $FolderFullName, $MessageUid, $oMessage);
            $oApiMailManager->deleteMessage($oAccount, $FolderFullName, array($MessageUid));
        }

        $rMessageStream = \MailSo\Base\ResourceRegistry::CreateMemoryResource();
        $iMessageStreamSize = \MailSo\Base\Utils::MultipleStreamWriter($oMessage->ToStream(true), array($rMessageStream), 8192, true, true, true);
        $iNewUid = 0;
        $oApiMailManager->appendMessageFromStream($oAccount, $rMessageStream, $FolderFullName, $iMessageStreamSize, $iNewUid);
        $oApiMailManager->setMessageFlag($oAccount, $FolderFullName, [$iNewUid], \MailSo\Imap\Enumerations\MessageFlag::SEEN, \Aurora\Modules\Mail\Enums\MessageStoreAction::Add);

        return $iNewUid;
    }

    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $aSettings = array(
            'DisplayNotesButton' => $this->oModuleSettings->DisplayNotesButton,
        );

        return $aSettings;
    }
}
