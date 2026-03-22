<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\GoogleAuthWebclient;

/**
 * This module adds ability to login using Google account.
 *
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
    protected $sService = 'google';

    protected $aRequireModules = array(
        'OAuthIntegratorWebclient',
        'Google'
    );

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

    /***** private functions *****/
    protected function issetScope($sScope)
    {
        return in_array($sScope, explode(' ', $this->oModuleSettings->Scopes));
    }

    /**
     * Initializes FacebookAuthWebclient Module.
     *
     * @ignore
     */
    public function init()
    {
        $this->subscribeEvent('OAuthIntegratorWebclient::GetServices::after', array($this, 'onAfterGetServices'));
        $this->subscribeEvent('OAuthIntegratorWebclient::GetServiceTypes::after', array($this, 'onAfterGetServiceTypes'));
        $this->subscribeEvent('OAuthIntegratorAction', array($this, 'onOAuthIntegratorAction'));
        $this->subscribeEvent('Google::GetSettings', array($this, 'onGetSettings'));
        $this->subscribeEvent('Google::UpdateSettings::after', array($this, 'onAfterUpdateSettings'));
        $this->subscribeEvent('RevokeAccessToken', array($this, 'onRevokeAccessToken'));
        $this->subscribeEvent('ResetAccessToken', array($this, 'onResetAccessToken'));
        $this->subscribeEvent('GetAccessToken', array($this, 'onGetAccessToken'));
    }

    /**
     * Adds service name to array passed by reference.
     *
     * @ignore
     * @param array $aArgs
     * @param array $aServices Array with services names passed by reference.
     */
    public function onAfterGetServices($aArgs, &$aServices)
    {
        $oModule = \Aurora\Modules\Google\Module::getInstance();
        $sId = $oModule->oModuleSettings->Id;
        $sSecret = $oModule->oModuleSettings->Secret;

        if ($oModule->oModuleSettings->EnableModule && $this->issetScope('auth') && !empty($sId) && !empty($sSecret)) {
            $aServices[] = $this->sService;
        }
    }

    /* Adds service type to array passed by reference.
    *
    * @ignore
    * @param array $aArgs
    * @param array $aServices Array with services names passed by reference.
    */
    public function onAfterGetServiceTypes($aArgs, &$aServices)
    {
        $oModule = \Aurora\Modules\Google\Module::getInstance();

        if ($oModule) {
            $sId = $oModule->oModuleSettings->Id;
            $sSecret = $oModule->oModuleSettings->Secret;

            if ($oModule->oModuleSettings->EnableModule && !empty($sId) && !empty($sSecret)) {
                $aServices[] = $this->sService;
            }
        }
    }

    /**
     * Passes data to connect to service.
     *
     * @ignore
     * @param string $aArgs Service type to verify if data should be passed.
     * @param boolean|array $mResult variable passed by reference to take the result.
     */
    public function onOAuthIntegratorAction($aArgs, &$mResult)
    {
        if (isset($aArgs['Service']) && $aArgs['Service'] === $this->sService) {
            $sOAuthScopes = isset($_COOKIE['oauth-scopes']) ? $_COOKIE['oauth-scopes'] : '';
            $aGoogleScopes = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ];
            $this->broadcastEvent('PopulateScopes', $sOAuthScopes, $aGoogleScopes);

            $mResult = false;
            $oConnector = new Classes\Connector($this);
            if ($oConnector) {
                $oGoogleModule = \Aurora\Modules\Google\Module::getInstance();
                if ($oGoogleModule) {
                    $sId = $oGoogleModule->oModuleSettings->Id;
                    $sSecret = $oGoogleModule->oModuleSettings->Secret;

                    $mResult = $oConnector->Init(
                        $sId,
                        $sSecret,
                        [$sOAuthScopes, \implode(' ', $aGoogleScopes)]
                    );
                }
            }
            return true;
        }
    }

    /**
     * Passes data to connect to service.
     *
     * @ignore
     * @param string $aArgs Service type to verify if data should be passed.
     * @param boolean|array $mResult variable passed by reference to take the result.
     */
    public function onGetSettings($aArgs, &$mResult)
    {
        $oUser = \Aurora\System\Api::getAuthenticatedUser();

        if ($oUser) {
            $aScope = array(
                'Name' => 'auth',
                'Description' => $this->i18N('SCOPE_AUTH'),
                'Value' => false
            );
            if ($oUser->Role === \Aurora\System\Enums\UserRole::SuperAdmin) {
                $aScope['Value'] = $this->issetScope('auth');
                $mResult['Scopes'][] = $aScope;
            }
            if ($oUser->isNormalOrTenant()) {
                if ($aArgs['OAuthAccount'] instanceof \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount) {
                    $aScope['Value'] = $aArgs['OAuthAccount']->issetScope('auth');
                }
                if ($this->issetScope('auth')) {
                    $mResult['Scopes'][] = $aScope;
                }
            }
        }
    }

    public function onAfterUpdateSettings($aArgs, &$mResult)
    {
        $sScope = '';
        if (isset($aArgs['Scopes']) && is_array($aArgs['Scopes'])) {
            foreach ($aArgs['Scopes'] as $aScope) {
                if ($aScope['Name'] === 'auth') {
                    if ($aScope['Value']) {
                        $sScope = 'auth';
                        break;
                    }
                }
            }
        }
        $this->setConfig('Scopes', $sScope);
        $this->saveModuleConfig();
    }

    public function onRevokeAccessToken($aArgs)
    {
        if (isset($aArgs['Service']) && $aArgs['Service'] === $this->sService) {
            $oConnector = new Classes\Connector($this);
            if ($oConnector) {
                $oGoogleModule = \Aurora\Modules\Google\Module::getInstance();
                if ($oGoogleModule) {
                    $sAccessToken = isset($aArgs['AccessToken']) ? $aArgs['AccessToken'] : '';
                    $oConnector->RevokeAccessToken(
                        $oGoogleModule->oModuleSettings->Id,
                        $oGoogleModule->oModuleSettings->Secret,
                        $sAccessToken
                    );
                }
            }
        }
    }

    public function onResetAccessToken($aArgs)
    {
        if (isset($aArgs['Service']) && $aArgs['Service'] === $this->sService) {
            $oConnector = new Classes\Connector($this);
            if ($oConnector) {
                $oGoogleModule = \Aurora\Modules\Google\Module::getInstance();
                if ($oGoogleModule) {
                    $oConnector->ResetAccessToken(
                        $oGoogleModule->oModuleSettings->Id,
                        $oGoogleModule->oModuleSettings->Secret
                    );
                }
            }
        }
    }

    public function onGetAccessToken($aArgs, &$mResult)
    {
        if (isset($aArgs['Service']) && $aArgs['Service'] === $this->sService && isset($aArgs['Account'])) {
            $mResult = false;
            /** @var \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount $oAccount */
            $oAccount = $aArgs['Account'];
            $oTokenData = \json_decode($oAccount->AccessToken);
            if ($oTokenData) {
                $iCreated = (int) $oTokenData->created;
                $iExpiresIn = (int) $oTokenData->expires_in;
                if (time() > ($iCreated + $iExpiresIn) && isset($oAccount->RefreshToken)) {
                    $oGoogleModule = \Aurora\Modules\Google\Module::getInstance();
                    if ($oGoogleModule) {
                        $oConnector = new Classes\Connector($this);
                        $aResult = $oConnector->RefreshAccessToken(
                            $oGoogleModule->oModuleSettings->Id,
                            $oGoogleModule->oModuleSettings->Secret,
                            $oAccount->RefreshToken
                        );
                        if (isset($aResult['access_token'])) {
                            $oTokenData->access_token = $aResult['access_token'];
                            $oTokenData->created = time();
                            $oTokenData->expires_in = $aResult['expires_in'];

                            $mResult = $oTokenData->access_token;

                            $oAccount->AccessToken = \json_encode($oTokenData);
                            $oAccount->save();
                        }
                    }
                } else {
                    $mResult = $oTokenData->access_token;
                }
            }

            return true;
        }
    }
}
