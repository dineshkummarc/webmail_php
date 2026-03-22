<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\AdminPanelWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property int $EntitiesPerPage
 * @property array $TabsOrder
 * @property array $EntitiesOrder
 */

class Settings extends \Aurora\System\Module\Settings
{
    protected function initDefaults()
    {
        $this->aContainer = [
            "Disabled" => new SettingsProperty(
                false,
                "bool",
                null,
                "Setting to true disables the module",
            ),
            "EntitiesPerPage" => new SettingsProperty(
                20,
                "int",
                null,
                "Number of items (users, domains etc.) shown per page in admin interface",
            ),
            "TabsOrder" => new SettingsProperty(
                [
                    "licensing",
                    "admin-security",
                    "admin-db",
                    "logs-viewer",
                    "system",
                    "common",
                    "modules"
                ],
                "array",
                null,
                "Defines list of adminpanel interface sections and the order of displaying those",
            ),
            "EntitiesOrder" => new SettingsProperty(
                [],
                "array",
                null,
                "Defines list of top menu entries and the order of displaying those",
            ),
        ];
    }
}
