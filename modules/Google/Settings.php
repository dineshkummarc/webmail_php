<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\Google;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property bool $EnableModule
 * @property string $Id
 * @property string $Secret
 * @property string $Key
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
            "EnableModule" => new SettingsProperty(
                false,
                "bool",
                null,
                "Setting to true allows for using and configuring the module",
            ),
            "Id" => new SettingsProperty(
                "",
                "string",
                null,
                "App ID obtained from Google app settings",
            ),
            "Secret" => new SettingsProperty(
                "",
                "string",
                null,
                "App secret obtained from Google app settings",
            ),
            "Key" => new SettingsProperty(
                "",
                "string",
                null,
                "API key obtained from Google app settings",
            ),
        ];
    }
}
