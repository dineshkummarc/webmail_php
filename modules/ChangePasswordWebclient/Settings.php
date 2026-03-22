<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\ChangePasswordWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property bool $ShowSingleMailChangePasswordInCommonSettings
 * @property bool $ShowSingleMailChangePasswordInSecuritySettings
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
            "ShowSingleMailChangePasswordInCommonSettings" => new SettingsProperty(
                false,
                "bool",
                null,
                "If set to true, Change Password button is displayed in Common settings rather than under Email Accounts section",
            ),
            "ShowSingleMailChangePasswordInSecuritySettings" => new SettingsProperty(
                false,
                "bool",
                null,
                "If set to true, Change Password button is displayed in Security settings, SecuritySettingsWebclient module",
            ),
        ];
    }
}
