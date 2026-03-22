<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailMasterPassword;

/**
 * This module adds ability to login to the admin panel as a Super Administrator.
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
    /***** private functions *****/
    /**
     * @return void
     */
    public function init()
    {
        $this->subscribeEvent('Core::Login::before', array($this, 'onBeforLogin'), 10);
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
     * Tries to log in with specified credentials.
     *
     * @param array $aArgs Parameters contain the required credentials.
     * @param array|mixed $mResult Parameter is passed by reference for further filling with result. Result is the array with data for authentication token.
     */
    public function onBeforLogin(&$aArgs, &$mResult)
    {
        $sPassword = $this->oModuleSettings->Password;

        if ($sPassword !== false && !empty($sPassword) && password_verify($aArgs['Password'], $sPassword)) {
            $oAccount = \Aurora\Modules\Mail\Module::getInstance()->getAccountsManager()->getAccountUsedToAuthorize($aArgs['Login']);
            if ($oAccount instanceof \Aurora\Modules\Mail\Models\MailAccount) {
                $aArgs['Password'] = $oAccount->getPassword();
            }
        }
    }
    /***** private functions *****/

    public function UpdateSettings($MasterPassword)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $bResult = false;

        try {
            $this->setConfig('Password', password_hash(trim($MasterPassword), PASSWORD_BCRYPT));
            $bResult = $this->saveModuleConfig();
        } catch (\Exception $ex) {
            throw new \Aurora\System\Exceptions\ApiException(\Aurora\System\Notifications::CanNotSaveSettings);
        }

        return $bResult;
    }
}
