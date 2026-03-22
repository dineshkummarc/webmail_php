<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\OAuthIntegratorWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property string $AuthModuleName
 * @property bool $OnlyPasswordForAccountCreate
 * @property bool $AllowNewUsersRegister
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
            "AuthModuleName" => new SettingsProperty(
                "StandardAuth",
                "string",
                null,
                "Reserved for authentication by login/password that relies on database",
            ),
            "OnlyPasswordForAccountCreate" => new SettingsProperty(
                true,
                "bool",
                null,
                "Enables adding password for Outlook Sync and Mobile Sync settings screen for otherwise passwordless accounts",
            ),
            "AllowNewUsersRegister" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables creating new user account on first login with a social account",
            ),
        ];
    }
}
