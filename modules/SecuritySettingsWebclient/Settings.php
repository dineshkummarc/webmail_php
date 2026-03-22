<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\SecuritySettingsWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property array $ModulesOrder
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
            "ModulesOrder" => new SettingsProperty(
                [
                    "ChangePasswordWebclient",
                    "StandardResetPassword",
                    "IPAllowList",
                    "TwoFactorAuth"
                ],
                "array",
                null,
                "Defines list of modules to be used and the order they're displayed in",
            ),
        ];
    }
}
