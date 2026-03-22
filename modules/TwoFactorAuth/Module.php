<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\TwoFactorAuth;

use Aurora\Modules\Core\Models\User;
use Aurora\Modules\TwoFactorAuth\Models\UsedDevice;
use Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey;
use Aurora\System\Api;
use PragmaRX\Recovery\Recovery;
use lbuchs\WebAuthn;
use Aurora\Modules\Core\Module as CoreModule;

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
    public static $VerifyState = false;

    private $oWebAuthn = null;

    /**
     * @var Manager $oUsedDevicesManager
     */
    protected $oUsedDevicesManager = null;

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

    public function init()
    {
        \Aurora\System\Router::getInstance()->registerArray(
            self::GetName(),
            [
                'assetlinks' => [$this, 'EntryAssetlinks'],
                'verify-security-key' => [$this, 'EntryVerifySecurityKey'],
            ]
        );

        $this->subscribeEvent('Core::Authenticate::after', array($this, 'onAfterAuthenticate'));
        $this->subscribeEvent('Core::SetAuthDataAndGetAuthToken::after', array($this, 'onAfterSetAuthDataAndGetAuthToken'), 10);
        $this->subscribeEvent('Core::Logout::before', array($this, 'onBeforeLogout'));
        $this->subscribeEvent('Core::DeleteUser::after', array($this, 'onAfterDeleteUser'));
        $this->subscribeEvent('System::RunEntry::before', array($this, 'onBeforeRunEntry'));

        $this->oWebAuthn = new WebAuthn\WebAuthn(
            'WebAuthn Library',
            $this->oHttp->GetHost(),
            [
                'android-key',
                'android-safetynet',
                'apple',
                'fido-u2f',
                'none',
                'packed',
                'tpm'
            ],
            false
            //            array_merge($this->oModuleSettings->FacetIds, [$this->oHttp->GetScheme().'://'.$this->oHttp->GetHost(true, false)])
        );
    }

    /**
     *
     * @return Manager
     */
    public function getUsedDevicesManager()
    {
        if ($this->oUsedDevicesManager === null) {
            $this->oUsedDevicesManager = new Manager($this);
        }

        return $this->oUsedDevicesManager;
    }

    /**
     * Obtains list of module settings for authenticated user.
     *
     * @return array
     */
    public function GetSettings()
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        $bAllowUsedDevices = $this->oModuleSettings->AllowUsedDevices;
        $aSettings = [
            'AllowBackupCodes' => $this->oModuleSettings->AllowBackupCodes,
            'AllowSecurityKeys' => $this->oModuleSettings->AllowSecurityKeys,
            'AllowAuthenticatorApp' => $this->oModuleSettings->AllowAuthenticatorApp,
            'AllowUsedDevices' => $bAllowUsedDevices,
            'TrustDevicesForDays' => $bAllowUsedDevices ? $this->oModuleSettings->TrustDevicesForDays : 0,
        ];

        $oUser = Api::getAuthenticatedUser();
        if ($oUser && $oUser->isNormalOrTenant()) {
            $bShowRecommendationToConfigure = $this->oModuleSettings->ShowRecommendationToConfigure;
            if ($bShowRecommendationToConfigure) {
                $bShowRecommendationToConfigure = $oUser->getExtendedProp($this->GetName() . '::ShowRecommendationToConfigure');
            }

            $bAuthenticatorAppEnabled = $this->oModuleSettings->AllowAuthenticatorApp && $oUser->getExtendedProp($this->GetName() . '::Secret') ? true : false;
            $aWebAuthKeysInfo = $this->oModuleSettings->AllowSecurityKeys ? $this->_getWebAuthKeysInfo($oUser) : [];
            $iBackupCodesCount = 0;
            if ($bAuthenticatorAppEnabled || count($aWebAuthKeysInfo) > 0) {
                $sBackupCodes = \Aurora\System\Utils::DecryptValue($oUser->getExtendedProp($this->GetName() . '::BackupCodes'));
                $aBackupCodes = empty($sBackupCodes) ? [] : json_decode($sBackupCodes);
                $aNotUsedBackupCodes = array_filter($aBackupCodes, function ($sCode) {
                    return !empty($sCode);
                });
                $iBackupCodesCount = count($aNotUsedBackupCodes);
            }

            $aSettings = array_merge($aSettings, [
                'ShowRecommendationToConfigure' => $bShowRecommendationToConfigure,
                'WebAuthKeysInfo' => $aWebAuthKeysInfo,
                'AuthenticatorAppEnabled' => $bAuthenticatorAppEnabled,
                'BackupCodesCount' => $iBackupCodesCount,
            ]);
        }

        return $aSettings;
    }

    public function UpdateSettings($ShowRecommendationToConfigure)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if ($this->oModuleSettings->ShowRecommendationToConfigure) {
            $oUser = Api::getAuthenticatedUser();
            if ($oUser && $oUser->isNormalOrTenant()) {
                $oUser->setExtendedProp($this->GetName() . '::ShowRecommendationToConfigure', $ShowRecommendationToConfigure);
                return $oUser->save();
            }
        }
        return false;
    }

    /**
     * Obtains user settings. Method is allowed for superadmin only.
     *
     * @param int $UserId
     * @return array|null
     */
    public function GetUserSettings($UserId)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if ($this->oModuleSettings->AllowAuthenticatorApp) {
            $oUser = Api::getUserById($UserId);
            if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
                Api::checkUserAccess($oUser);
                $iWebAuthnKeyCount = WebAuthnKey::where('UserId', $oUser->Id)->count();
                return [
                    'TwoFactorAuthEnabled' => !empty($oUser->getExtendedProp($this->GetName() . '::Secret')) || $iWebAuthnKeyCount > 0
                ];
            }
        }

        return null;
    }

    public function onAfterDeleteUser($aArgs, &$mResult)
    {
        if ($mResult) {
            UsedDevice::where('UserId', $aArgs['UserId'])->delete();
        }
    }

    /**
     * Disables two factor authentication for specified user. Method is allowed for superadmin only.
     *
     * @param int $UserId
     * @return boolean
     */
    public function DisableUserTwoFactorAuth($UserId)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);

        if (!$this->oModuleSettings->AllowAuthenticatorApp) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getUserById($UserId);
        if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
            Api::checkUserAccess($oUser);

            $oUser->setExtendedProp($this->GetName() . '::Secret', '');
            $oUser->setExtendedProp($this->GetName() . '::IsEncryptedSecret', false);

            $oUser->setExtendedProp($this->GetName() . '::Challenge', '');
            $aWebAuthnKeys = WebAuthnKey::where('UserId', $oUser->Id)->get();

            $bResult = true;
            foreach ($aWebAuthnKeys as $oWebAuthnKey) {
                $bResult = $bResult && $oWebAuthnKey->delete();
            }

            $oUser->setExtendedProp($this->GetName() . '::BackupCodes', '');
            $oUser->setExtendedProp($this->GetName() . '::BackupCodesTimestamp', '');
            $bResult = $bResult && \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);

            $bResult = $bResult && $this->getUsedDevicesManager()->revokeTrustFromAllDevices($oUser);

            return $bResult;
        }


        return false;
    }

    /**
     * Verifies user's password and returns Secret and QR-code
     *
     * @param string $Password
     * @return bool|array
     */
    public function RegisterAuthenticatorAppBegin($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowAuthenticatorApp) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oGoogle = new \PHPGangsta_GoogleAuthenticator();
        $sSecret = '';
        if ($oUser->getExtendedProp($this->GetName() . '::Secret')) {
            $sSecret = $oUser->getExtendedProp($this->GetName() . '::Secret');
            if ($oUser->getExtendedProp($this->GetName() . '::IsEncryptedSecret')) {
                $sSecret = \Aurora\System\Utils::DecryptValue($sSecret);
            }
        } else {
            $sSecret = $oGoogle->createSecret();
        }
        $sServerName = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : $_SERVER['HTTP_HOST'];
        if (!empty($sServerName)) {
            $sServerName = "(" . $sServerName . ")";
        }
        $sQRCodeName = $oUser->PublicId . $sServerName;

        return [
            'Secret' => $sSecret,
            'QRCodeName' => $sQRCodeName,
            'Enabled' => $oUser->getExtendedProp($this->GetName() . '::Secret') ? true : false
        ];
    }

    /**
     * Verifies user's Code and saves Secret in case of success
     *
     * @param string $Password
     * @param string $Code
     * @param string $Secret
     * @return boolean
     * @throws \Aurora\System\Exceptions\ApiException
     */
    public function RegisterAuthenticatorAppFinish($Password, $Code, $Secret)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowAuthenticatorApp) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password) || empty($Code) || empty($Secret)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $bResult = false;
        $iClockTolerance = $this->oModuleSettings->ClockTolerance;
        $oGoogle = new \PHPGangsta_GoogleAuthenticator();

        $oStatus = $oGoogle->verifyCode($Secret, $Code, $iClockTolerance);
        if ($oStatus === true) {
            $oUser->setExtendedProp($this->GetName() . '::Secret', \Aurora\System\Utils::EncryptValue($Secret));
            $oUser->setExtendedProp($this->GetName() . '::IsEncryptedSecret', true);
            \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
            $bResult = true;
        }

        return $bResult;
    }

    /**
     * Verifies user's Password and disables TwoFactorAuth in case of success
     *
     * @param string $Password
     * @return bool
     */
    public function DisableAuthenticatorApp($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowAuthenticatorApp) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser->setExtendedProp($this->GetName() . '::Secret', "");
        $oUser->setExtendedProp($this->GetName() . '::IsEncryptedSecret', false);
        $bResult = \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
        $this->_removeAllDataWhenAllSecondFactorsDisabled($oUser);

        return $bResult;
    }

    /**
     * Verifies Authenticator code and returns AuthToken in case of success
     *
     * @param string $Code
     * @param string $Login
     * @param string $Password
     * @return bool|array
     * @throws \Aurora\System\Exceptions\ApiException
     */
    public function VerifyAuthenticatorAppCode($Code, $Login, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        if (!$this->oModuleSettings->AllowAuthenticatorApp) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Code) || empty($Login)  || empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        self::$VerifyState = true;
        $mAuthenticateResult = \Aurora\Modules\Core\Module::Decorator()->Authenticate($Login, $Password);
        self::$VerifyState = false;
        if (!$mAuthenticateResult || !is_array($mAuthenticateResult) || !isset($mAuthenticateResult['token'])) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
        }

        $oUser = Api::getUserById((int) $mAuthenticateResult['id']);
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mResult = false;
        if ($oUser->getExtendedProp($this->GetName() . '::Secret')) {
            $sSecret = $oUser->getExtendedProp($this->GetName() . '::Secret');
            if ($oUser->getExtendedProp($this->GetName() . '::IsEncryptedSecret')) {
                $sSecret = \Aurora\System\Utils::DecryptValue($sSecret);
            }
            $oGoogle = new \PHPGangsta_GoogleAuthenticator();
            $iClockTolerance = $this->oModuleSettings->ClockTolerance;
            $oStatus = $oGoogle->verifyCode($sSecret, $Code, $iClockTolerance);
            if ($oStatus) {
                $mResult = \Aurora\Modules\Core\Module::Decorator()->SetAuthDataAndGetAuthToken($mAuthenticateResult);

            }
        } else {
            throw new \Aurora\System\Exceptions\ApiException(Enums\ErrorCodes::SecretNotSet);
        }

        return $mResult;
    }

    /**
     * Verifies user's password and returns backup codes generated earlier.
     *
     * @param string $Password
     * @return array|boolean
     */
    public function GetBackupCodes($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowBackupCodes) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $sBackupCodes = \Aurora\System\Utils::DecryptValue($oUser->getExtendedProp($this->GetName() . '::BackupCodes'));
        return [
            'Datetime' => $oUser->getExtendedProp($this->GetName() . '::BackupCodesTimestamp'),
            'Codes' => empty($sBackupCodes) ? [] : json_decode($sBackupCodes)
        ];
    }

    /**
     * Verifies user's password, generates backup codes and returns them.
     *
     * @param string $Password
     * @return array|boolean
     */
    public function GenerateBackupCodes($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowBackupCodes) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oRecovery = new Recovery();
        $aCodes = $oRecovery
            ->setCount(10) // Generate 10 codes
            ->setBlocks(2) // Every code must have 2 blocks
            ->setChars(4) // Each block must have 4 chars
            ->setBlockSeparator(' ')
            ->uppercase()
            ->toArray();

        $oUser->setExtendedProp($this->GetName() . '::BackupCodes', \Aurora\System\Utils::EncryptValue(json_encode($aCodes)));
        $oUser->setExtendedProp($this->GetName() . '::BackupCodesTimestamp', time());
        \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);

        return [
            'Datetime' => $oUser->getExtendedProp($this->GetName() . '::BackupCodesTimestamp'),
            'Codes' => $aCodes,
        ];
    }

    public function VerifyBackupCode($BackupCode, $Login, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        if (!$this->oModuleSettings->AllowBackupCodes) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($BackupCode) || empty($Login)  || empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        self::$VerifyState = true;
        $mAuthenticateResult = \Aurora\Modules\Core\Module::Decorator()->Authenticate($Login, $Password);
        self::$VerifyState = false;
        if (!$mAuthenticateResult || !is_array($mAuthenticateResult) || !isset($mAuthenticateResult['token'])) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
        }

        $oUser = Api::getUserById((int) $mAuthenticateResult['id']);
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mResult = false;
        $sBackupCodes = \Aurora\System\Utils::DecryptValue($oUser->getExtendedProp($this->GetName() . '::BackupCodes'));
        $aBackupCodes = empty($sBackupCodes) ? [] : json_decode($sBackupCodes);
        $sTrimmed = preg_replace('/\s+/', '', $BackupCode);
        $sPrepared = substr_replace($sTrimmed, ' ', 4, 0);
        $index = array_search($sPrepared, $aBackupCodes);
        if ($index !== false) {
            $aBackupCodes[$index] = '';
            $oUser->setExtendedProp($this->GetName() . '::BackupCodes', \Aurora\System\Utils::EncryptValue(json_encode($aBackupCodes)));
            \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
            $mResult = \Aurora\Modules\Core\Module::Decorator()->SetAuthDataAndGetAuthToken($mAuthenticateResult);

        }
        return $mResult;
    }

    /**
     * Checks if User has TwoFactorAuth enabled and return UserId instead of AuthToken
     *
     * @param array $aArgs
     * @param array $mResult
     */
    public function onAfterAuthenticate($aArgs, &$mResult)
    {
        if (!self::$VerifyState && $mResult && is_array($mResult) && isset($mResult['token'])) {
            $oUser = Api::getUserById((int) $mResult['id']);
            if ($oUser instanceof User) {
                $bHasSecurityKey = false;
                if ($this->oModuleSettings->AllowSecurityKeys) {
                    $iWebAuthnKeyCount = WebAuthnKey::where('UserId', $oUser->Id)->count();
                    $bHasSecurityKey = $iWebAuthnKeyCount > 0;
                }

                $bHasAuthenticatorApp = false;
                if ($this->oModuleSettings->AllowAuthenticatorApp) {
                    $bHasAuthenticatorApp = !!(!empty($oUser->getExtendedProp($this->GetName() . '::Secret')));
                }

                $bDeviceTrusted = ($bHasAuthenticatorApp || $bHasAuthenticatorApp) ? $this->getUsedDevicesManager()->checkDeviceAfterAuthenticate($oUser) : false;

                if (($bHasSecurityKey || $bHasAuthenticatorApp) && !$bDeviceTrusted) {
                    $mResult = [
                        'TwoFactorAuth' => [
                            'HasAuthenticatorApp' => $bHasAuthenticatorApp,
                            'HasSecurityKey' => $bHasSecurityKey,
                            'HasBackupCodes' => $this->oModuleSettings->AllowBackupCodes && !empty($oUser->getExtendedProp($this->GetName() . '::BackupCodes'))
                        ]
                    ];
                }
            }
        }
    }

    /**
     * Verifies user's password and returns arguments for security key registration.
     *
     * @param string $Password
     * @return array|boolean
     */
    public function RegisterSecurityKeyBegin($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oCreateArgs = $this->oWebAuthn->getCreateArgs(
            \base64_encode($oUser->UUID),
            $oUser->PublicId,
            $oUser->PublicId,
            90,
            false,
            'discouraged',
            true,
            []
        );

        $oCreateArgs->publicKey->user->id = \base64_encode($oCreateArgs->publicKey->user->id->getBinaryString());
        $oCreateArgs->publicKey->challenge = \base64_encode($oCreateArgs->publicKey->challenge->getBinaryString());
        $oUser->setExtendedProp($this->GetName() . '::Challenge', $oCreateArgs->publicKey->challenge);
        $oUser->save();

        return $oCreateArgs;
    }

    /**
     * Verifies user's password and finishes security key registration.
     *
     * @param array $Attestation
     * @param string $Password
     * @return boolean
     * @throws \Aurora\System\Exceptions\ApiException
     */
    public function RegisterSecurityKeyFinish($Attestation, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password) || empty($Attestation)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $data = $this->oWebAuthn->processCreate(
            \base64_decode($Attestation['clientDataJSON']),
            \base64_decode($Attestation['attestationObject']),
            \base64_decode($oUser->getExtendedProp($this->GetName() . '::Challenge')),
            false
        );
        $data->credentialId = \base64_encode($data->credentialId);
        $data->AAGUID = \base64_encode($data->AAGUID);

        $sEncodedSecurityKeyData = \json_encode($data);
        if ($sEncodedSecurityKeyData === false) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::UnknownError, null, json_last_error_msg());
        } else {
            $oWebAuthnKey = new WebAuthnKey();
            $oWebAuthnKey->UserId = $oUser->Id;
            $oWebAuthnKey->KeyData = $sEncodedSecurityKeyData;
            $oWebAuthnKey->CreationDateTime = time();

            if ($oWebAuthnKey->save()) {
                return $oWebAuthnKey->Id;
            }
        }

        return false;
    }

    /**
     * Authenticates user and returns arguments for security key verification.
     *
     * @param string $Login
     * @param string $Password
     * @return array|boolean
     */
    public function VerifySecurityKeyBegin($Login, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        self::$VerifyState = true;
        $mAuthenticateResult = \Aurora\Modules\Core\Module::Decorator()->Authenticate($Login, $Password);
        self::$VerifyState = false;
        if (!$mAuthenticateResult || !is_array($mAuthenticateResult) || !isset($mAuthenticateResult['token'])) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
        }

        $oUser = Api::getUserById((int) $mAuthenticateResult['id']);
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mGetArgs = false;
        $aIds = [];
        $aWebAuthnKeys = WebAuthnKey::where('UserId', $oUser->Id)->get();

        foreach ($aWebAuthnKeys as $oWebAuthnKey) {
            /** @var WebAuthnKey $oWebAuthnKey */
            $oKeyData = \json_decode($oWebAuthnKey->KeyData);
            $aIds[] = \base64_decode($oKeyData->credentialId);
        }

        if (count($aIds) > 0) {
            $mGetArgs = $this->oWebAuthn->getGetArgs(
                $aIds,
                90
            );
            $mGetArgs->publicKey->challenge = \base64_encode($mGetArgs->publicKey->challenge->getBinaryString());
            if (is_array($mGetArgs->publicKey->allowCredentials)) {
                foreach ($mGetArgs->publicKey->allowCredentials as $key => $val) {
                    $val->id = \base64_encode($val->id->getBinaryString());
                    $mGetArgs->publicKey->allowCredentials[$key] = $val;
                }
            }

            $oUser->setExtendedProp($this->GetName() . '::Challenge', $mGetArgs->publicKey->challenge);
            $oUser->save();
        }

        return $mGetArgs;
    }

    /**
     * Authenticates user and finishes security key verification.
     *
     * @param string $Login
     * @param string $Password
     * @param array $Attestation
     * @return boolean
     * @throws \Aurora\System\Exceptions\ApiException
     */
    public function VerifySecurityKeyFinish($Login, $Password, $Attestation)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        self::$VerifyState = true;
        $mAuthenticateResult = \Aurora\Modules\Core\Module::Decorator()->Authenticate($Login, $Password);
        self::$VerifyState = false;
        if (!$mAuthenticateResult || !is_array($mAuthenticateResult) || !isset($mAuthenticateResult['token'])) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
        }

        $oUser = Api::getUserById((int) $mAuthenticateResult['id']);
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mResult = true;
        $clientDataJSON = base64_decode($Attestation['clientDataJSON']);
        $authenticatorData = base64_decode($Attestation['authenticatorData']);
        $signature = base64_decode($Attestation['signature']);
        $id = base64_decode($Attestation['id']);
        $credentialPublicKey = null;

        $challenge = \base64_decode($oUser->getExtendedProp($this->GetName() . '::Challenge'));

        $aWebAuthnKeys = WebAuthnKey::where('UserId', $oUser->Id)->get();

        $oWebAuthnKey = null;
        foreach ($aWebAuthnKeys as $oWebAuthnKey) {
            /** @var WebAuthnKey $oWebAuthnKey */
            $oKeyData = \json_decode($oWebAuthnKey->KeyData);
            if (\base64_decode($oKeyData->credentialId) === $id) {
                $credentialPublicKey = $oKeyData->credentialPublicKey;
                break;
            }
        }

        if ($credentialPublicKey !== null) {
            try {
                // process the get request. throws WebAuthnException if it fails
                $this->oWebAuthn->processGet($clientDataJSON, $authenticatorData, $signature, $credentialPublicKey, $challenge, null, false);
                $mResult = \Aurora\Modules\Core\Module::Decorator()->SetAuthDataAndGetAuthToken($mAuthenticateResult);


                if (isset($oWebAuthnKey)) {
                    $oWebAuthnKey->LastUsageDateTime = time();
                    $oWebAuthnKey->save();
                }
            } catch (\Exception $oEx) {
                $mResult = false;
                throw new \Aurora\System\Exceptions\ApiException(999, $oEx, $oEx->getMessage());
            }
        }

        return $mResult;
    }

    /**
     * Verifies user's password and changes security key name.
     *
     * @param int $KeyId
     * @param string $NewName
     * @param string $Password
     * @return boolean
     */
    public function UpdateSecurityKeyName($KeyId, $NewName, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password) || empty($KeyId) || empty($NewName)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mResult = false;
        $oWebAuthnKey = WebAuthnKey::where('UserId', $oUser->Id)
            ->where('Id', $KeyId)
            ->first();

        if ($oWebAuthnKey instanceof WebAuthnKey) {
            $oWebAuthnKey->Name = $NewName;
            $mResult = $oWebAuthnKey->save();
        }
        return $mResult;
    }

    /**
     * Verifies user's password and removes secutiry key.
     *
     * @param int $KeyId
     * @param string $Password
     * @return boolean
     */
    public function DeleteSecurityKey($KeyId, $Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowSecurityKeys) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($Password) || empty($KeyId)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        if (!CoreModule::Decorator()->VerifyPassword($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $mResult = false;
        $oWebAuthnKey = WebAuthnKey::where('UserId', $oUser->Id)
            ->where('Id', $KeyId)
            ->first();
        if ($oWebAuthnKey instanceof WebAuthnKey) {
            $mResult = $oWebAuthnKey->delete();
            $this->_removeAllDataWhenAllSecondFactorsDisabled($oUser);
        }
        return $mResult;
    }

    /**
     * Verifies user's password.
     *
     * @param string $Password
     * @return boolean
     */
    public function VerifyPassword($Password)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (empty($Password)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        return CoreModule::Decorator()->VerifyPassword($Password);
    }

    public function EntryVerifySecurityKey()
    {
        $oModuleManager = Api::GetModuleManager();
        $sTheme = $oModuleManager->getModuleConfigValue('CoreWebclient', 'Theme');

        $oHttp = \MailSo\Base\Http::SingletonInstance();
        $sLogin = $oHttp->GetQuery('login', '');
        $sPassword = $oHttp->GetQuery('password', '');
        $sPackageName = $oHttp->GetQuery('package_name', '');
        if (empty($sLogin) || empty($sPassword)) {
            return '';
        }

        $oGetArgs = false;
        $sError = false;
        try {
            $oGetArgs = self::Decorator()->VerifySecurityKeyBegin($sLogin, $sPassword);
        } catch (\Exception $oEx) {
            $sError = $oEx->getCode() . ': ' . $oEx->getMessage();
        }
        $sResult = \file_get_contents($this->GetPath() . '/templates/EntryVerifySecurityKey.html');
        $sResult = \strtr($sResult, array(
            '{{GetArgs}}' => \Aurora\System\Managers\Response::GetJsonFromObject(null, $oGetArgs),
            '{{PackageName}}' => $sPackageName,
            '{{Error}}' => $sError,
            '{{Description}}' => $this->i18N('HINT_INSERT_TOUCH_SECURITY_KEY'),
            '{{Theme}}' => $sTheme,
        ));
        \Aurora\Modules\CoreWebclient\Module::Decorator()->SetHtmlOutputHeaders();
        @header('Cache-Control: no-cache', true);
        return $sResult;
    }

    public function EntryAssetlinks()
    {
        @header('Content-Type: application/json; charset=utf-8');
        @header('Cache-Control: no-cache', true);

        $sPath = __DIR__ . '/assets/assetlinks.json';
        $sDistPath = __DIR__ . '/assets/assetlinks.dist.json';

        if (file_exists($sPath)) {
            $sFileContent = file_get_contents($sPath);
        } elseif (file_exists($sDistPath)) {
            $sFileContent = file_get_contents($sDistPath);
        } else {
            $sFileContent = "[]";
        }

        echo $sFileContent;
    }

    public function TrustDevice($DeviceId, $DeviceName)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowUsedDevices) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $authToken = Api::getAuthToken();

        $oUser = Api::getAuthenticatedUser($authToken);
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        return $this->getUsedDevicesManager()->trustDevice($oUser->Id, $DeviceId, $DeviceName, $authToken);
    }

    /**
     * @deprecated since version 9.7.2. Use SetDeviceName instead.
     */
    public function SaveDevice($DeviceId, $DeviceName)
    {
        return $this->Decorator()->SetDeviceName($DeviceId, $DeviceName);
    }

    /**
     * @param string $DeviceId
     * @param string $DeviceName
     *
     * @return boolean
     */
    public function SetDeviceName($DeviceId, $DeviceName)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!is_string($DeviceId) && count($DeviceId) < 4 && empty($DeviceName)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        $mResult = false;

        if ($this->oModuleSettings->AllowUsedDevices) {
            $oUser = Api::getAuthenticatedUser();
            $mResult = $this->getUsedDevicesManager()->setDeviceName($oUser->Id, $DeviceId, $DeviceName);
        }

        return $mResult;
    }

    /**
     * @param string $DeviceId
     * @param string $DeviceCustomName
     *
     * @return boolean
     */
    public function SetDeviceCustomName($DeviceId, $DeviceCustomName)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!is_string($DeviceId) && count($DeviceId) < 4 && empty($DeviceCustomName)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        $mResult = false;

        if ($this->oModuleSettings->AllowUsedDevices) {
            $oUser = Api::getAuthenticatedUser();
            $mResult = $this->getUsedDevicesManager()->setDeviceCustomName($oUser->Id, $DeviceId, $DeviceCustomName);
        }

        return $mResult;
    }

    public function GetUsedDevices()
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowUsedDevices) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        return $this->getUsedDevicesManager()->getAllDevices($oUser->Id)->all();
    }

    public function RevokeTrustFromAllDevices()
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowUsedDevices) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (!$this->getUsedDevicesManager()->isTrustedDevicesEnabled()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        return $this->getUsedDevicesManager()->revokeTrustFromAllDevices($oUser);
    }

    public function onBeforeLogout($aArgs, &$mResult)
    {
        $oUser = Api::getAuthenticatedUser();
        if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
            $oUsedDevice = $this->getUsedDevicesManager()->getDeviceByAuthToken($oUser->Id, Api::getAuthToken());
            if ($oUsedDevice) {
                $oUsedDevice->AuthToken = '';
                $oUsedDevice->save();
            }
        }
    }

    public function LogoutFromDevice($DeviceId)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        if (!$this->oModuleSettings->AllowUsedDevices) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        $oUser = Api::getAuthenticatedUser();
        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($DeviceId)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        $oUsedDevice = $this->getUsedDevicesManager()->getDevice($oUser->Id, $DeviceId);
        if ($oUsedDevice && !empty($oUsedDevice->AuthToken)) {
            Api::UserSession()->Delete($oUsedDevice->AuthToken);
            $oUsedDevice->AuthToken = '';
            $oUsedDevice->TrustTillDateTime = $oUsedDevice->CreationDateTime; // revoke trust
            $oUsedDevice->save();
        }
        return true;
    }

    public function RemoveDevice($DeviceId)
    {
        Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);
        $oUser = Api::getAuthenticatedUser();
        if (!$this->oModuleSettings->AllowUsedDevices && !$oUser->isAdmin()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (!($oUser instanceof User) || !$oUser->isNormalOrTenant() && !$oUser->isAdmin()) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AccessDenied);
        }

        if (empty($DeviceId)) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::InvalidInputParameter);
        }

        $oUsedDevice = $oUser->isAdmin() ? $this->getUsedDevicesManager()->getDeviceByDeviceId($DeviceId) : $this->getUsedDevicesManager()->getDevice($oUser->Id, $DeviceId);
        if ($oUsedDevice) {
            Api::UserSession()->Delete($oUsedDevice->AuthToken);
            $oUsedDevice->delete();
        }
        return true;
    }

    protected function _getWebAuthKeysInfo($oUser)
    {
        $aWebAuthKeysInfo = [];

        if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
            $aWebAuthnKeys = WebAuthnKey::where('UserId', $oUser->Id)->get();
            foreach ($aWebAuthnKeys as $oWebAuthnKey) {
                /** @var WebAuthnKey $oWebAuthnKey */
                $aWebAuthKeysInfo[] = [
                    $oWebAuthnKey->Id,
                    $oWebAuthnKey->Name
                ];
            }
        }

        return $aWebAuthKeysInfo;
    }

    protected function _removeAllDataWhenAllSecondFactorsDisabled($oUser)
    {
        $iWebAuthnKeyCount = WebAuthnKey::where('UserId', $oUser->Id)->count();
        if (empty($oUser->getExtendedProp($this->GetName() . '::Secret')) && $iWebAuthnKeyCount === 0) {
            $oUser->setExtendedProp($this->GetName() . '::BackupCodes', '');
            $oUser->setExtendedProp($this->GetName() . '::BackupCodesTimestamp', '');
            \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);

            $this->getUsedDevicesManager()->revokeTrustFromAllDevices($oUser);
        }
    }

    public function onBeforeRunEntry(&$aArgs, &$mResult)
    {
        $error = false;
        if ($aArgs['EntryName'] === 'api' && $this->oModuleSettings->AllowUsedDevices) {
            $user = \Aurora\System\Api::getAuthenticatedUser();
            $authToken = \Aurora\System\Api::getAuthenticatedUserAuthToken();

            if ($user && $user->isNormalOrTenant()) {
                $deviceId = Api::getDeviceIdFromHeaders();

                if ($deviceId) {
                    $usedDevice = $this->getUsedDevicesManager()->getDevice($user->Id, $deviceId);

                    if (!$usedDevice) {
                        $error = true;
                    } elseif ($usedDevice->AuthToken !== $authToken) {
                        $error = true;
                    }
                } else {
                    $error = true;
                }
            }
        }
        if ($error) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
        }
    }

    public function onAfterSetAuthDataAndGetAuthToken(&$aArgs, &$mResult)
    {
        if (is_array($mResult) && isset($mResult[\Aurora\System\Application::AUTH_TOKEN_KEY]) && $this->oModuleSettings->AllowUsedDevices) {
            $deviceId = Api::getDeviceIdFromHeaders();
            if ($deviceId && is_string($deviceId)) {
                $sFallbackName = $_SERVER['HTTP_USER_AGENT'] ?? $_SERVER['REMOTE_ADDR'];
                $sFallbackName = substr((string)explode(' ', $sFallbackName)[0], 0, 255);
                $this->getUsedDevicesManager()->saveDevice(Api::getAuthenticatedUserId(), $deviceId, $sFallbackName, $mResult[\Aurora\System\Application::AUTH_TOKEN_KEY]);
            } else {
                throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::AuthError);
            }
        }
    }
}
