<?php

/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailSignupPlesk;

/**
 * Allows users to create new email accounts for themselves on Plesk.
 *
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
    /**
     * @var \PleskX\Api\Client
     */
    private $oClient;

    public function init()
    {
        $this->subscribeEvent('MailSignup::Signup::before', [$this, 'onAfterSignup']);

        $sPleskHost = $this->oModuleSettings->PleskHostname;
        $this->oClient = new \PleskX\Api\Client($sPleskHost);

        $sPleskUser = $this->oModuleSettings->PleskAdminUser;
        $sPleskPass = $this->oModuleSettings->PleskAdminPassword;

        if ($sPleskPass && !\Aurora\System\Utils::IsEncryptedValue($sPleskPass)) {
            $this->setConfig('PleskAdminPassword', \Aurora\System\Utils::EncryptValue($sPleskPass));
            $this->saveModuleConfig();
        } else {
            $sPleskPass = \Aurora\System\Utils::DecryptValue($sPleskPass);
        }

        $this->oClient->setCredentials($sPleskUser, $sPleskPass);
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

    /**
     * Creates account with credentials specified in registration form
     *
     * @param array $aArgs New account credentials.
     * @param mixed $mResult Is passed by reference.
     */
    public function onAfterSignup($aArgs, &$mResult)
    {
        if (isset($aArgs['Login']) && isset($aArgs['Password']) && !empty(trim($aArgs['Password'])) && !empty(trim($aArgs['Login']))) {
            $sLogin = trim($aArgs['Login']);
            $sPassword = trim($aArgs['Password']);
            $sFriendlyName = isset($aArgs['Name']) ? trim($aArgs['Name']) : '';
            $bSignMe = isset($aArgs['SignMe']) ? (bool) $aArgs['SignMe'] : false;

            $bPrevState = \Aurora\System\Api::skipCheckUserRole(true);
            [$sUsername, $sDomain] = explode("@", $sLogin);
            try {
                $mResult = $this->oClient->site()->get("name", $sDomain);
            } catch (\Exception $oException) {
                throw new \Aurora\System\Exceptions\ApiException(0, null, $oException->getMessage());
            }

            if (is_object($mResult) && isset($mResult->id) && is_numeric($mResult->id)) {
                $iSiteId = intval($mResult->id);
                $aResult = array();
                try {
                    $mResult2 = $this->oClient->mail()->create($sUsername, $iSiteId, true, $sPassword);
                } catch(\Exception $oException) {
                    throw new \Aurora\System\Exceptions\ApiException(0, $oException, $oException->getMessage());
                }
                $iUserId = null;
                try {
                    $iUserId = \Aurora\Modules\Core\Module::Decorator()->CreateUser(0, $sLogin);
                    $oUser = \Aurora\System\Api::getUserById((int) $iUserId);
                    $oAccount = \Aurora\Modules\Mail\Module::Decorator()->CreateAccount($oUser->Id, $sFriendlyName, $sLogin, $sLogin, $sPassword);
                    if ($oAccount instanceof \Aurora\Modules\Mail\Models\MailAccount) {
                        $iTime = $bSignMe ? 0 : time();
                        $sAuthToken = \Aurora\System\Api::UserSession()->Set(
                            [
                                'token'		=> 'auth',
                                'sign-me'		=> $bSignMe,
                                'id'			=> $oAccount->IdUser,
                                'account'		=> $oAccount->Id,
                                'account_type'	=> $oAccount->getName()
                            ],
                            $iTime
                        );
                        $mResult = [\Aurora\System\Application::AUTH_TOKEN_KEY => $sAuthToken];
                    }
                } catch (\Exception $oException) {
                    if ($oException instanceof \Aurora\Modules\Mail\Exceptions\Exception &&
                        $oException->getCode() === \Aurora\Modules\Mail\Enums\ErrorCodes::CannotLoginCredentialsIncorrect &&
                        is_int($iUserId) && ($iUserId > 0)) {
                        \Aurora\Modules\Core\Module::Decorator()->DeleteUser($iUserId);
                    }
                    throw $oException;
                }
            } else {
                throw new \Aurora\System\Exceptions\ApiException(0, null, "Site not found");
            }
            \Aurora\System\Api::skipCheckUserRole($bPrevState);
        }
        return true;
    }
}
