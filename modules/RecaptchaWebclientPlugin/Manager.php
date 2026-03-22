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
 * @ignore
 *
 * @property Module $oModule
 */
class Manager extends \Aurora\System\Managers\AbstractManager
{
    protected $recaptchaToken = null;
    protected $allowRecaptchaCheckOnLogin = true;

    /**
     * @param \Aurora\System\Module\AbstractModule $oModule
     */
    public function __construct(\Aurora\System\Module\AbstractModule $oModule = null)
    {
        parent::__construct($oModule);
    }

    public function isRecaptchaEnabledForIP()
    {
        return !in_array(\Aurora\System\Utils::getClientIp(), $this->oModule->oModuleSettings->WhitelistIPs);
    }

    public function memorizeRecaptchaWebclientPluginToken($aArgs)
    {
        if (isset($aArgs['RecaptchaWebclientPluginToken']) && !empty($aArgs['RecaptchaWebclientPluginToken'])) {
            $this->recaptchaToken = $aArgs['RecaptchaWebclientPluginToken'];
        }
    }

    public function disableRecaptchaCheckOnLogin()
    {
        $this->allowRecaptchaCheckOnLogin = false;
    }

    public function needToCheckRecaptchaOnLogin()
    {
        if (!$this->allowRecaptchaCheckOnLogin) {
            return false;
        }

        if (!$this->isRecaptchaEnabledForIP()) {
            return false;
        }

        $authErrorCount = isset($_COOKIE['auth-error']) ? (int) $_COOKIE['auth-error'] : 0;
        // If the user has exceeded the number of authentication attempts
        if ($authErrorCount >= $this->oModule->oModuleSettings->LimitCount) {
            return true;
        }

        return false;
    }

    public function checkIfRecaptchaError()
    {
        if ($this->recaptchaToken === null) {
            \Aurora\System\Api::Log('RECAPTCHA error: no token');
            return [
                'Error' => [
                    'Code' => Enums\ErrorCodes::RecaptchaVerificationError,
                    'ModuleName' => $this->oModule->GetName(),
                    'Override' => true
                ]
            ];
        }

        $privateKey = $this->oModule->oModuleSettings->PrivateKey;
        $recaptcha = new \ReCaptcha\ReCaptcha($privateKey, $this->getRequestMethod());
        $response = $recaptcha->verify($this->recaptchaToken);
        if (!$response->isSuccess()) {
            \Aurora\System\Api::Log('RECAPTCHA error: ' . implode(', ', $response->getErrorCodes()));
            return [
                'Error' => [
                    'Code' => Enums\ErrorCodes::RecaptchaUnknownError,
                    'ModuleName' => $this->oModule->GetName(),
                    'Override' => true
                ]
            ];
        }

        return false;
    }

    public function clearAuthErrorCount()
    {
        //If the user is authenticated, reset the counter for unsuccessful attempts.
        if (isset($_COOKIE['auth-error'])) {
            \Aurora\System\Api::setCookie(
                'auth-error',
                0,
                \strtotime('+1 hour'),
                false
            );
        }
    }

    public function incrementAuthErrorCount()
    {
        $iAuthErrorCount = isset($_COOKIE['auth-error']) ? ((int) $_COOKIE['auth-error'] + 1) : 1;
        \Aurora\System\Api::setCookie(
            'auth-error',
            $iAuthErrorCount,
            \strtotime('+1 hour'),
            false
        );
    }

    private function getRequestMethod()
    {
        $sRequestMethod = $this->oModule->oModuleSettings->RequestMethod;
        switch ($sRequestMethod) {
            case Enums\RequestMethods::CurlPost:
                return new \ReCaptcha\RequestMethod\CurlPost();
            case Enums\RequestMethods::Post:
                return new \ReCaptcha\RequestMethod\Post();
            case Enums\RequestMethods::SocketPost:
            default:
                return new \ReCaptcha\RequestMethod\SocketPost();
        }
    }
}
