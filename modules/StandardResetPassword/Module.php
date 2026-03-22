<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\StandardResetPassword;

use Aurora\System\Api;
use Aurora\System\Application;
use PHPMailer\PHPMailer\PHPMailer;
use Aurora\Modules\Core\Models\User;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
    /***** private functions *****/
    /**
     * Initializes Module.
     *
     * @ignore
     */
    public function init()
    {
        $this->extendObject(
            'Aurora\Modules\Core\Classes\User',
            array(
                'RecoveryEmail' => array('string', ''),
                'PasswordResetHash' => array('string', ''),
                'ConfirmRecoveryEmailHash' => array('string', ''),
            )
        );

        $this->aErrors = [
            Enums\ErrorCodes::WrongPassword => $this->i18N('ERROR_WRONG_PASSWORD'),
        ];

        $this->AddEntry('confirm-recovery-email', 'EntryConfirmRecoveryEmail');
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

    public function EntryConfirmRecoveryEmail()
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);
        $sHash = (string) \Aurora\System\Router::getItemByIndex(1, '');
        $oModuleManager = Api::GetModuleManager();
        $sSiteName = $oModuleManager->getModuleConfigValue('Core', 'SiteName');
        $sTheme = $oModuleManager->getModuleConfigValue('CoreWebclient', 'Theme');

        $oUser = null;
        try {
            $oUser = $this->getUserByHash($sHash, 'confirm-recovery-email');
        } catch (\Exception $oEx) {
            Api::LogException($oEx);
        }
        $ConfirmRecoveryEmailHeading = '';
        $ConfirmRecoveryEmailInfo = '';
        if ($oUser instanceof User && $sHash === $oUser->getExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash')) {
            $ConfirmRecoveryEmailHeading = $this->i18N('HEADING_CONFIRM_EMAIL_RECOVERY_HASH');
            $ConfirmRecoveryEmailInfo = \strtr($this->i18N('INFO_CONFIRM_EMAIL_RECOVERY_HASH'), [
                '%SITE_NAME%' => $sSiteName,
                '%RECOVERY_EMAIL%' => $oUser->getExtendedProp(self::GetName() . '::RecoveryEmail'),
            ]);
            $oMin = \Aurora\Modules\Min\Module::Decorator();
            if ($oMin) {
                $oMin->DeleteMinByHash($sHash);
            }
            $oUser->setExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash', '');
            $oCoreDecorator = \Aurora\Modules\Core\Module::Decorator();
            $oCoreDecorator->UpdateUserObject($oUser);
        } else {
            $ConfirmRecoveryEmailHeading = $this->i18N('HEADING_CONFIRM_EMAIL_RECOVERY_HASH');
            $ConfirmRecoveryEmailInfo = $this->i18N('ERROR_LINK_NOT_VALID');
        }
        $sConfirmRecoveryEmailTemplate = \file_get_contents($this->GetPath() . '/templates/EntryConfirmRecoveryEmail.html');

        \Aurora\Modules\CoreWebclient\Module::Decorator()->SetHtmlOutputHeaders();
        return \strtr($sConfirmRecoveryEmailTemplate, array(
            '{{SiteName}}' => $sSiteName . ' - ' . $ConfirmRecoveryEmailHeading,
            '{{Theme}}' => $sTheme,
            '{{ConfirmRecoveryEmailHeading}}' => $ConfirmRecoveryEmailHeading,
            '{{ConfirmRecoveryEmailInfo}}' => $ConfirmRecoveryEmailInfo,
            '{{ActionOpenApp}}' => \strtr($this->i18N('ACTION_OPEN_SITENAME'), ['%SITE_NAME%' => $sSiteName]),
            '{{OpenAppUrl}}' => Application::getBaseUrl(),
        ));
    }

    protected function getMinId($iUserId, $sType, $sFunction = '')
    {
        return \implode('|', array(self::GetName(), $iUserId, \md5($iUserId), $sType, $sFunction));
    }

    protected function generateHash($iUserId, $sType, $sFunction = '')
    {
        $mHash = '';
        $oMin = \Aurora\Modules\Min\Module::Decorator();
        if ($oMin) {
            $sMinId = $this->getMinId($iUserId, $sType, $sFunction);
            $mHash = $oMin->GetMinByID($sMinId);

            if ($mHash) {
                $mHash = $oMin->DeleteMinByID($sMinId);
            }

            $iRecoveryLinkLifetimeMinutes = $this->oModuleSettings->RecoveryLinkLifetimeMinutes;
            $iExpiresSeconds = time() + $iRecoveryLinkLifetimeMinutes * 60;
            $mHash = $oMin->CreateMin(
                $sMinId,
                array(
                    'UserId' => $iUserId,
                    'Type' => $sType
                ),
                $iUserId,
                $iExpiresSeconds
            );
        }

        return $mHash;
    }

    protected function getSmtpConfig()
    {
        return [
            'Host' => $this->oModuleSettings->NotificationHost,
            'Port' => $this->oModuleSettings->NotificationPort,
            'UseSsl' => !empty($this->oModuleSettings->NotificationSMTPSecure),
            'SMTPAuth' => (bool) $this->oModuleSettings->NotificationUseAuth,
            'SMTPSecure' => $this->oModuleSettings->NotificationSMTPSecure,
            'Username' => $this->oModuleSettings->NotificationLogin,
            'Password' => \Aurora\System\Utils::DecryptValue($this->oModuleSettings->NotificationPassword),
        ];
    }

    protected function getMailAccountByEmail($sEmail)
    {
        $oAccount = null;
        $oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserByPublicId($sEmail);
        if ($oUser instanceof User) {
            $bPrevState = \Aurora\Api::skipCheckUserRole(true);
            if (class_exists('\Aurora\Modules\Mail\Module')) {
                $oAccount = \Aurora\Modules\Mail\Module::Decorator()->GetAccountByEmail($sEmail, $oUser->Id);
            }
            \Aurora\Api::skipCheckUserRole($bPrevState);
        }
        return $oAccount;
    }

    protected function getMailAccountConfig($sEmail)
    {
        $aConfig = [
            'Host' => '',
            'Port' => '',
            'UseSsl' => false,
            'SMTPSecure' => 'ssl',
            'SMTPAuth' => false,
            'Username' => '',
            'Password' => '',
        ];

        if (class_exists('\Aurora\Modules\Mail\Enums\SmtpAuthType')) {
            $oSendAccount = $this->getMailAccountByEmail($sEmail);
            $oSendServer = $oSendAccount ? $oSendAccount->getServer() : null;
            if ($oSendServer) {
                $aConfig['Host'] = $oSendServer->OutgoingServer;
                $aConfig['Port'] = $oSendServer->OutgoingPort;
                switch ($oSendServer->SmtpAuthType) {
                    case \Aurora\Modules\Mail\Enums\SmtpAuthType::NoAuthentication:
                        break;
                    case \Aurora\Modules\Mail\Enums\SmtpAuthType::UseSpecifiedCredentials:
                        $aConfig['UseSsl'] = $oSendServer->OutgoingUseSsl;
                        $aConfig['SMTPAuth'] = true;
                        $aConfig['Username'] = $oSendServer->SmtpLogin;
                        $aConfig['Password'] = $oSendServer->SmtpPassword;
                        break;
                    case \Aurora\Modules\Mail\Enums\SmtpAuthType::UseUserCredentials:
                        $aConfig['UseSsl'] = $oSendServer->OutgoingUseSsl;
                        $aConfig['SMTPAuth'] = true;
                        $aConfig['Username'] = $oSendAccount->IncomingLogin;
                        $aConfig['Password'] = $oSendAccount->getPassword();
                        break;
                }
            }
        }

        return $aConfig;
    }

    /**
     * Sends notification email.
     * @param string $sRecipientEmail
     * @param string $sSubject
     * @param string $sBody
     * @param bool $bIsHtmlBody
     * @param string $sSiteName
     * @return bool
     * @throws \Exception
     */
    protected function sendMessage($sRecipientEmail, $sSubject, $sBody, $bIsHtmlBody, $sSiteName)
    {
        $bResult = false;

        $oMail = new PHPMailer();

        $sFrom = $this->oModuleSettings->NotificationEmail;
        $sType = \strtolower($this->oModuleSettings->NotificationType);
        switch ($sType) {
            case 'mail':
                $oMail->isMail();
                break;
            case 'smtp':
            case 'account':
                $oMail->isSMTP();
                $aConfig = $sType === 'smtp' ? $this->getSmtpConfig() : $this->getMailAccountConfig($sFrom);
                $oMail->Host = $aConfig['Host'];
                $oMail->Port = $aConfig['Port'];
                $oMail->SMTPAuth = $aConfig['SMTPAuth'];
                if ($aConfig['UseSsl']) {
                    $oMail->SMTPSecure = $aConfig['SMTPSecure'];
                }
                $oMail->Username = $aConfig['Username'];
                $oMail->Password = $aConfig['Password'];
                $oMail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    )
                );
                break;
        }

        //$oMail->Timeout = 10; // seconds
        $oMail->setFrom($sFrom);
        $oMail->addAddress($sRecipientEmail);
        $oMail->addReplyTo($sFrom, $sSiteName);

        $oMail->Subject = $sSubject;
        $oMail->Body = $sBody;
        $oMail->isHTML($bIsHtmlBody);

        try {
            $bResult = $oMail->send();
        } catch (\Exception $oEx) {
            Api::LogException($oEx);
            throw new \Exception($oEx->getMessage());
        }
        if (!$bResult && !empty($oMail->ErrorInfo)) {
            Api::Log("Message could not be sent. Mailer Error: {$oMail->ErrorInfo}");
            throw new \Exception($oMail->ErrorInfo);
        }

        return $bResult;
    }

    protected function getHashModuleName()
    {
        return $this->oModuleSettings->HashModuleName;
    }
    /**
     * Sends password reset message.
     * @param string $sRecipientEmail
     * @param string $sHash
     * @return boolean
     */
    protected function sendPasswordResetMessage($sRecipientEmail, $sHash)
    {
        $oModuleManager = Api::GetModuleManager();
        $sSiteName = $oModuleManager->getModuleConfigValue('Core', 'SiteName');

        $sBody = \file_get_contents($this->GetPath() . '/templates/mail/Message.html');
        if (\is_string($sBody)) {
            $sGreeting = $this->i18N('LABEL_MESSAGE_GREETING');
            $sMessage = \strtr($this->i18N('LABEL_RESET_PASSWORD_MESSAGE'), [
                '%SITE_NAME%' => $sSiteName,
                '%RESET_PASSWORD_URL%' => \rtrim(Application::getBaseUrl(), '\\/ ') . '/#' . $this->getHashModuleName() . '/' . $sHash,
            ]);
            $sSignature = \strtr($this->i18N('LABEL_MESSAGE_SIGNATURE'), ['%SITE_NAME%' => $sSiteName]);
            $sBody = \strtr($sBody, array(
                '{{GREETING}}' => $sGreeting,
                '{{MESSAGE}}' => $sMessage,
                '{{SIGNATURE}}' => $sSignature,
            ));
        }
        $bIsHtmlBody = true;
        $sSubject = $this->i18N('LABEL_RESET_PASSWORD_SUBJECT');
        return $this->sendMessage($sRecipientEmail, $sSubject, $sBody, $bIsHtmlBody, $sSiteName);
    }

    /**
     * Sends recovery email confirmation message.
     * @param string $sRecipientEmail
     * @param string $sHash
     * @return bool
     */
    protected function sendRecoveryEmailConfirmationMessage($sRecipientEmail, $sHash)
    {
        $oModuleManager = Api::GetModuleManager();
        $sSiteName = $oModuleManager->getModuleConfigValue('Core', 'SiteName');

        $sBody = \file_get_contents($this->GetPath() . '/templates/mail/Message.html');
        if (\is_string($sBody)) {
            $sGreeting = $this->i18N('LABEL_MESSAGE_GREETING');
            $sMessage = \strtr($this->i18N('LABEL_CONFIRM_EMAIL_MESSAGE'), [
                '%RECOVERY_EMAIL%' => $sRecipientEmail,
                '%SITE_NAME%' => $sSiteName,
                '%RESET_PASSWORD_URL%' => \rtrim(Application::getBaseUrl(), '\\/ ') . '?/confirm-recovery-email/' . $sHash,
            ]);
            $sSignature = \strtr($this->i18N('LABEL_MESSAGE_SIGNATURE'), ['%SITE_NAME%' => $sSiteName]);
            $sBody = \strtr($sBody, array(
                '{{GREETING}}' => $sGreeting,
                '{{MESSAGE}}' => $sMessage,
                '{{SIGNATURE}}' => $sSignature,
            ));
        }
        $bIsHtmlBody = true;
        $sSubject = \strtr($this->i18N('LABEL_CONFIRM_EMAIL_SUBJECT'), ['%RECOVERY_EMAIL%' => $sRecipientEmail]);
        return $this->sendMessage($sRecipientEmail, $sSubject, $sBody, $bIsHtmlBody, $sSiteName);
    }

    /**
     * Returns user with identifier obtained from the hash.
     *
     * @param string $sHash
     * @param string $sType
     * @param boolean $bAdd5Min
     * @return \Aurora\Modules\Core\Models\User
     */
    protected function getUserByHash($sHash, $sType, $bAdd5Min = false)
    {
        $oUser = null;
        $oMin = \Aurora\Modules\Min\Module::Decorator();
        $mHash = $oMin ? $oMin->GetMinByHash($sHash) : null;
        if (!empty($mHash) && isset($mHash['__hash__'], $mHash['UserId'], $mHash['Type']) && $mHash['Type'] === $sType) {
            $iRecoveryLinkLifetimeMinutes = $this->oModuleSettings->RecoveryLinkLifetimeMinutes;
            $bRecoveryLinkPrmament = ($iRecoveryLinkLifetimeMinutes === 0);
            if (!$bRecoveryLinkPrmament) {
                $iExpiresSeconds = $mHash['ExpireDate'];
                if ($bAdd5Min) {
                    $iExpiresSeconds += 5 * 60;
                }
                if ($iExpiresSeconds > time()) {
                    $bRecoveryLinkPrmament = true;
                } else {
                    throw new \Exception($this->i18N('ERROR_LINK_NOT_VALID'));
                }
            }
            if ($bRecoveryLinkPrmament) {
                $iUserId = $mHash['UserId'];
                $bPrevState = \Aurora\Api::skipCheckUserRole(true);
                $oUser = \Aurora\Modules\Core\Module::Decorator()->GetUser($iUserId);
                \Aurora\Api::skipCheckUserRole($bPrevState);
            }
        }
        return $oUser;
    }

    /**
     * Get recovery email address partly replaced with stars.
     * @param \Aurora\Modules\Core\Models\User $oUser
     * @return string
     */
    protected function getStarredRecoveryEmail($oUser)
    {
        $sResult = '';

        if ($oUser instanceof User) {
            $sRecoveryEmail = $oUser->getExtendedProp(self::GetName() . '::RecoveryEmail');
            if (!empty($sRecoveryEmail)) {
                $aRecoveryEmailParts = explode('@', $sRecoveryEmail);
                $iPartsCount = count($aRecoveryEmailParts);
                if ($iPartsCount > 0) {
                    $sResult = substr($aRecoveryEmailParts[0], 0, 3) . '***';
                }
                if ($iPartsCount > 1) {
                    $sResult .= '@' . $aRecoveryEmailParts[$iPartsCount - 1];
                }
            }
        }

        return $sResult;
    }

    private function getAuthenticatedAccount()
    {
        $aUserInfo = Api::getAuthenticatedUserInfo();

        $oAccount = null;

        if (isset($aUserInfo['account']) && isset($aUserInfo['accountType']) && class_exists($aUserInfo['accountType'])) {
            $oAccount = call_user_func_array([$aUserInfo['accountType'], 'find'], [(int)$aUserInfo['account']]);
        }

        return $oAccount;
    }

    private function getAccountById($iUserId, $iAccountId, $sAccountType)
    {
        $oAccount = null;

        $aAccounts = \Aurora\Modules\Core\Module::Decorator()->GetUserAccounts($iUserId);

        foreach ($aAccounts as $oItem) {
            if ($oItem['Id'] === $iAccountId && $oItem['Type'] === $sAccountType && class_exists($oItem['Type'])) {
                $oAccount = call_user_func_array([ $oItem['Type'], 'find'], [(int)$oItem['Id']]);
            }
        }

        return $oAccount;
    }
    /***** private functions *****/

    /***** public functions might be called with web API *****/
    /**
     * Obtains list of module settings for authenticated user.
     *
     * @return array
     */
    public function GetSettings()
    {

        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $aSettings = [
            'HashModuleName' => $this->oModuleSettings->HashModuleName,
            'CustomLogoUrl' => $this->oModuleSettings->CustomLogoUrl,
            'BottomInfoHtmlText' => $this->oModuleSettings->BottomInfoHtmlText,
        ];

        $oAuthenticatedUser = Api::getAuthenticatedUser();
        if ($oAuthenticatedUser instanceof User) {
            if ($oAuthenticatedUser->isNormalOrTenant()) {
                $iRecoveryAccountId = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::RecoveryAccountId');
                $sRecoveryAccountType = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::RecoveryAccountType');
                $oAccount = $this->getAccountById($oAuthenticatedUser->Id, $iRecoveryAccountId, $sRecoveryAccountType);

                $aSettings['RecoveryEmail'] = $this->getStarredRecoveryEmail($oAuthenticatedUser);
                $aSettings['RecoveryEmailConfirmed'] = empty($oAuthenticatedUser->getExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash'));
                $aSettings['RecoveryAccount'] = $oAccount ? $oAccount->getLogin() : '';
            }
            if ($oAuthenticatedUser->Role === \Aurora\System\Enums\UserRole::SuperAdmin) {
                $aSettings['RecoveryLinkLifetimeMinutes'] = $this->oModuleSettings->RecoveryLinkLifetimeMinutes;
                $aSettings['NotificationEmail'] = $this->oModuleSettings->NotificationEmail;
                $aSettings['NotificationType'] = $this->oModuleSettings->NotificationType;
                $aSettings['NotificationHost'] = $this->oModuleSettings->NotificationHost;
                $aSettings['NotificationPort'] = $this->oModuleSettings->NotificationPort;
                $aSettings['NotificationSMTPSecure'] = $this->oModuleSettings->NotificationSMTPSecure;
                $aSettings['NotificationUseAuth'] = $this->oModuleSettings->NotificationUseAuth;
                $aSettings['NotificationLogin'] = $this->oModuleSettings->NotificationLogin;
                $aSettings['HasNotificationPassword'] = !empty($this->oModuleSettings->NotificationPassword);
            }
        }

        return $aSettings;
    }

    /**
     * Updates per user settings.
     * @param string $RecoveryEmail
     * @param string $Password
     * @return boolean|string
     * @throws \Aurora\System\Exceptions\ApiException
     * @throws \Aurora\Modules\StandardResetPassword\Exceptions\Exception
     */
    public function UpdateSettings($RecoveryEmail = null, $Password = null)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if ($RecoveryEmail === null || $Password === null) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        $oAuthenticatedUser = Api::getAuthenticatedUser();
        if ($oAuthenticatedUser instanceof User && $oAuthenticatedUser->isNormalOrTenant()) {
            $oAccount = $this->getAuthenticatedAccount();

            if ($Password === null || ($oAccount && $oAccount->getPassword() !== $Password)) {
                throw new \Aurora\Modules\StandardResetPassword\Exceptions\Exception(Enums\ErrorCodes::WrongPassword);
            }

            $sPrevRecoveryEmail = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::RecoveryEmail');
            $sPrevConfirmRecoveryEmail = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::ConfirmRecoveryEmail');
            $sPrevAccountId = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::RecoveryAccountId');
            $sPrevAccountType = $oAuthenticatedUser->getExtendedProp(self::GetName() . '::RecoveryAccountType');

            $sConfirmRecoveryEmailHash = !empty($RecoveryEmail) ? $this->generateHash($oAuthenticatedUser->Id, 'confirm-recovery-email', __FUNCTION__) : '';

            $oAuthenticatedUser->setExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash', $sConfirmRecoveryEmailHash);
            $oAuthenticatedUser->setExtendedProp(self::GetName() . '::RecoveryEmail', $RecoveryEmail);
            $oAuthenticatedUser->setExtendedProp(self::GetName() . '::RecoveryAccountId', $oAccount->Id);
            $oAuthenticatedUser->setExtendedProp(self::GetName() . '::RecoveryAccountType', $oAccount->getName());

            $bResult = \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oAuthenticatedUser);
            if ($bResult) {

                if (!empty($RecoveryEmail)) {
                    $oSentException = null;
                    try {
                        // Send message to confirm recovery email if it's not empty.
                        $bResult = $this->sendRecoveryEmailConfirmationMessage($RecoveryEmail, $sConfirmRecoveryEmailHash);
                    } catch (\Exception $oException) {
                        $bResult = false;
                        $oSentException = $oException;
                    }

                    if (!$bResult) {
                        $oAuthenticatedUser->setExtendedProps([
                            self::GetName() . '::ConfirmRecoveryEmailHash' => $sPrevConfirmRecoveryEmail,
                            self::GetName() . '::RecoveryEmail', $sPrevRecoveryEmail,
                            self::GetName() . '::RecoveryAccountId', $sPrevAccountId,
                            self::GetName() . '::RecoveryAccountType', $sPrevAccountType
                        ]);
                        \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oAuthenticatedUser);
                    }

                    if ($oSentException !== null) {
                        throw $oSentException;
                    }
                }
            }

            if ($bResult) {
                return [
                    'RecoveryEmail' => $this->getStarredRecoveryEmail($oAuthenticatedUser),
                    'RecoveryAccount' => $oAccount->getLogin()
                ];
            } else {
                return false;
            }
        }

        throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
    }

    /**
         * Updates per user settings.
         * @param int $RecoveryLinkLifetimeMinutes
         * @param string $NotificationEmail
         * @param string $NotificationType
         * @param string $NotificationHost
         * @param int $NotificationPort
         * @param string $NotificationSMTPSecure
         * @param boolean $NotificationUseAuth
         * @param string $NotificationLogin
         * @param string $NotificationPassword
         * @return boolean|string
         * @throws \Aurora\System\Exceptions\ApiException
         * @throws \Aurora\Modules\StandardResetPassword\Exceptions\Exception
         */
    public function UpdateAdminSettings(
        $RecoveryLinkLifetimeMinutes,
        $NotificationEmail,
        $NotificationType,
        $NotificationHost = null,
        $NotificationPort = null,
        $NotificationSMTPSecure = null,
        $NotificationUseAuth = null,
        $NotificationLogin = null,
        $NotificationPassword = null
    ) {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $this->setConfig('RecoveryLinkLifetimeMinutes', $RecoveryLinkLifetimeMinutes);
        $this->setConfig('NotificationEmail', $NotificationEmail);
        $this->setConfig('NotificationType', $NotificationType);
        if ($NotificationType === 'smtp') {
            $this->setConfig('NotificationHost', $NotificationHost);
            $this->setConfig('NotificationPort', $NotificationPort);
            $this->setConfig('NotificationSMTPSecure', $NotificationSMTPSecure);
            $this->setConfig('NotificationUseAuth', $NotificationUseAuth);
            if ($NotificationUseAuth) {
                $this->setConfig('NotificationLogin', $NotificationLogin);
                $this->setConfig('NotificationPassword', \Aurora\System\Utils::EncryptValue($NotificationPassword));
            }
        }
        return $this->saveModuleConfig();
    }

    /**
     * Get recovery email address partly replaced with stars.
     * @param string $UserPublicId
     * @return string
     */
    public function GetStarredRecoveryEmailAddress($UserPublicId)
    {
        $sRecoveryEmail = '';
        $oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserByPublicId($UserPublicId);
        if ($oUser) {
            $sRecoveryEmail = $this->getStarredRecoveryEmail($oUser);
            $sConfirmRecoveryEmailHash = $oUser->getExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash');
            if (!empty($sConfirmRecoveryEmailHash)) { // email is not confirmed
                $sRecoveryEmail = '';
            }
        }
        return $sRecoveryEmail;
    }

    /**
     * Creates a recovery link and sends it to recovery email of the user with specified public ID.
     *
     * @param string $UserPublicId
     * @return boolean
     * @throws \Exception
     */
    public function SendPasswordResetEmail($UserPublicId)
    {
        $oUser = \Aurora\Modules\Core\Module::Decorator()->GetUserByPublicId($UserPublicId);
        if ($oUser instanceof User) {
            $bPrevState = \Aurora\Api::skipCheckUserRole(true);
            $sPasswordResetHash = $this->generateHash($oUser->Id, $this->getHashModuleName(), __FUNCTION__);
            $oUser->setExtendedProp(self::GetName() . '::PasswordResetHash', $sPasswordResetHash);
            \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
            \Aurora\Api::skipCheckUserRole($bPrevState);

            $sRecoveryEmail = $oUser->getExtendedProp(self::GetName() . '::RecoveryEmail');
            $sConfirmRecoveryEmailHash = $oUser->getExtendedProp(self::GetName() . '::ConfirmRecoveryEmailHash');
            if (!empty($sRecoveryEmail) && empty($sConfirmRecoveryEmailHash)) {
                return $this->sendPasswordResetMessage($sRecoveryEmail, $sPasswordResetHash);
            }
        }

        throw new \Exception($this->i18N('ERROR_RECOVERY_EMAIL_NOT_FOUND'));
    }

    /**
     * Returns public id of user obtained from the hash.
     *
     * @param string $Hash Hash with information about user.
     * @return string
     */
    public function GetUserPublicId($Hash)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $oUser = $this->getUserByHash($Hash, $this->getHashModuleName());

        if ($oUser instanceof User) {
            return $oUser->PublicId;
        }
        return '';
    }

    /**
     * Changes password if hash is valid.
     * @param string $Hash
     * @param string $NewPassword
     * @return boolean
     * @throws \Aurora\System\Exceptions\ApiException
     */
    public function ChangePassword($Hash, $NewPassword)
    {
        $bPrevState =  Api::skipCheckUserRole(true);

        $oMin = \Aurora\Modules\Min\Module::Decorator();
        $mResult = false;

        if ($oMin && !empty($Hash) && $NewPassword) {
            $oUser = $this->getUserByHash($Hash, $this->getHashModuleName(), true);
            $oAccount = null;

            if ($oUser) {
                $iAccountId = $oUser->getExtendedProp(self::GetName() . '::RecoveryAccountId');
                $sAccountType = $oUser->getExtendedProp(self::GetName() . '::RecoveryAccountType');

                $oAccount = $this->getAccountById($oUser->Id, $iAccountId, $sAccountType);
            }

            if ($oUser && $oAccount) {
                $aArgs = [
                    'Account' => $oAccount,
                    'CurrentPassword' => $oAccount->getPassword(),
                    'NewPassword' => $NewPassword
                ];
                $aResponse = [
                    'AccountPasswordChanged' => false
                ];

                $this->broadcastEvent('ChangeAccountPassword', $aArgs, $aResponse);

                $mResult = $aResponse['AccountPasswordChanged'];

                if ($mResult) {
                    $oMin->DeleteMinByHash($Hash);
                    Api::UserSession()->DeleteAllAccountSessions($oAccount);
                }
            } else {
                throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
            }
        } else {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        Api::skipCheckUserRole($bPrevState);

        return $mResult;
    }
    /***** public functions might be called with web API *****/
}
