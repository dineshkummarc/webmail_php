<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\RecaptchaWebclientPlugin;

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
    protected $manager = null;

    protected function getManager()
    {
        if ($this->manager === null) {
            $this->manager = new Manager($this);
        }

        return $this->manager;
    }

    public function init()
    {
        $this->aErrors = [
            Enums\ErrorCodes::RecaptchaVerificationError	=> $this->i18N('ERROR_RECAPTCHA_VERIFICATION_DID_NOT_COMPLETE'),
            Enums\ErrorCodes::RecaptchaUnknownError		=> $this->i18N('ERROR_UNKNOWN_RECAPTCHA_ERROR'),
        ];

        \Aurora\System\EventEmitter::getInstance()->onAny(
            [
                ['MailLoginFormWebclient::Login::before', [$this, 'onBeforeMailLoginFormWebclientLogin']],
                ['StandardRegisterFormWebclient::Register::before', [$this, 'onBeforeStandardRegisterFormWebclientRegister']],
                ['StandardLoginFormWebclient::Login::before', [$this, 'onBeforeStandardLoginFormWebclient'], 90],
                ['MailSignup::Signup::before', [$this, 'onSignup'], 90],
                ['Core::Login::after', [$this, 'onAfterLogin']]
            ]
        );

        $this->subscribeEvent('AddToContentSecurityPolicyDefault', array($this, 'onAddToContentSecurityPolicyDefault'));
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

    public function onAddToContentSecurityPolicyDefault($aArgs, &$aAddDefault)
    {
        $aAddDefault[] = 'www.google.com www.gstatic.com';
    }

    /**
     * Obtains list of module settings for authenticated user.
     * @return array
     */
    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return [
            'PublicKey' => $this->oModuleSettings->PublicKey,
            'LimitCount' => $this->oModuleSettings->LimitCount,
            'ShowRecaptcha' => $this->getManager()->isRecaptchaEnabledForIP(),
        ];
    }

    public function onBeforeStandardRegisterFormWebclientRegister($aArgs, &$mResult, &$mSubscriptionResult)
    {
        if ($this->getManager()->isRecaptchaEnabledForIP()) {
            $this->getManager()->memorizeRecaptchaWebclientPluginToken($aArgs);

            $mSubscriptionResult = $this->getManager()->checkIfRecaptchaError();
            if (!empty($mSubscriptionResult)) {
                // The result contains an error -> stop executing the Register method
                return true;
            }

            $this->getManager()->disableRecaptchaCheckOnLogin();
        }
    }

    public function onBeforeMailLoginFormWebclientLogin($aArgs, &$mResult, &$mSubscriptionResult)
    {
        $this->getManager()->memorizeRecaptchaWebclientPluginToken($aArgs);
    }

    public function onBeforeStandardLoginFormWebclient($aArgs, &$mResult, &$mSubscriptionResult)
    {
        if ($this->getManager()->needToCheckRecaptchaOnLogin()) {
            $this->getManager()->memorizeRecaptchaWebclientPluginToken($aArgs);

            $mSubscriptionResult = $this->getManager()->checkIfRecaptchaError();
            if (!empty($mSubscriptionResult)) {
                // The result contains an error -> stop executing the Login method
                return true;
            }

            $this->getManager()->clearAuthErrorCount();
        }
    }

    public function onSignup($aArgs, &$mResult, &$mSubscriptionResult)
    {
        if ($this->getManager()->isRecaptchaEnabledForIP()) {
            $this->getManager()->memorizeRecaptchaWebclientPluginToken($aArgs);

            $mSubscriptionResult = $this->getManager()->checkIfRecaptchaError();
            if (!empty($mSubscriptionResult)) {
                // The result contains an error -> stop executing the Register method
                return true;
            }
        }
    }

    public function onAfterLogin($aArgs, &$mResult)
    {
        // if authentication has failed, increment auth-error counter
        if (!(is_array($mResult) && isset($mResult[\Aurora\System\Application::AUTH_TOKEN_KEY]))) {
            $this->getManager()->incrementAuthErrorCount();
        }
    }
}
