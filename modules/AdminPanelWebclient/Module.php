<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\AdminPanelWebclient;

/**
 * Displays admin panel web interface.
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 * @internal
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
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
     * Obtains list of module settings for authenticated user.
     *
     * @return array
     */
    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::TenantAdmin);

        $aTenants = [];

        try {
            // Settings should be obtainable even if db is not configured yet
            $aTenants = \Aurora\Modules\Core\Module::Decorator()->GetTenants(0, 0, '');
        } catch (\Exception $ex) {
        }

        return array(
            'EntitiesPerPage' => $this->oModuleSettings->EntitiesPerPage,
            'TabsOrder' => $this->oModuleSettings->TabsOrder,
            'EntitiesOrder' => $this->oModuleSettings->EntitiesOrder,
            'Tenants' => $aTenants,
        );
    }
}
