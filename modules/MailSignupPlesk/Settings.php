<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailSignupPlesk;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property string $PleskHostname
 * @property string $PleskAdminUser
 * @property string $PleskAdminPassword
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
            "PleskHostname" => new SettingsProperty(
                "localhost",
                "string",
                null,
                "Defines hostname of Plesk installation",
            ),
            "PleskAdminUser" => new SettingsProperty(
                "admin",
                "string",
                null,
                "Username of Plesk administrator account",
            ),
            "PleskAdminPassword" => new SettingsProperty(
                "",
                "string",
                null,
                "Password of Plesk administrator account. Will be automatically encrypted.",
            ),
        ];
    }
}
