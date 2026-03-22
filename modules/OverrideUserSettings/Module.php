<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\OverrideUserSettings;

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
        $this->subscribeEvent('Core::CreateUser::after', array($this, 'onAfterCreateUser'));
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

    public function onAfterCreateUser(&$aArgs, &$mResult)
    {
        $iUserId = isset($mResult) && (int) $mResult > 0 ? (int) $mResult : 0;
        if ($iUserId > 0) {
            $oUser = \Aurora\Api::getUserById($iUserId);

            if ($oUser) {
                $aDomains = $this->oModuleSettings->Domains;
                if (is_array($aDomains) && !empty($aDomains)) {
                    $sUserDomain = \MailSo\Base\Utils::GetDomainFromEmail($oUser->PublicId);
                    foreach ($aDomains as $aDomain) {
                        if ($aDomain["name"] === $sUserDomain && isset($aDomain["modules"]) && is_array($aDomain["modules"])) {
                            foreach ($aDomain["modules"] as $sModuleName) {
                                $oUser->disableModule($sModuleName);
                                \Aurora\Modules\Core\Module::Decorator()->UpdateUserObject($oUser);
                            }
                        }
                    }
                }
            }
        }
    }
}
