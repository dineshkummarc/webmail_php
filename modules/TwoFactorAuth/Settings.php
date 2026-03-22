<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\TwoFactorAuth;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property bool $ShowRecommendationToConfigure
 * @property bool $AllowSecurityKeys
 * @property array $FacetIds
 * @property bool $AllowAuthenticatorApp
 * @property int $ClockTolerance
 * @property bool $AllowBackupCodes
 * @property bool $AllowUsedDevices
 * @property int $TrustDevicesForDays
 * @property bool $IncludeInMobile
 * @property bool $IncludeInDesktop
 * @property array $RequireInMobile
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
            "ShowRecommendationToConfigure" => new SettingsProperty(
                false,
                "bool",
                null,
                "If true, users will get a message suggesting to enable 2FA if it's not enabled in their accounts yet",
            ),
            "AllowSecurityKeys" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables support for security keys",
            ),
            "FacetIds" => new SettingsProperty(
                [],
                "array",
                null,
                "List of app-key-hashes of mobile apps",
            ),
            "AllowAuthenticatorApp" => new SettingsProperty(
                true,
                "bool",
                null,
                "Enables use of authenticator app",
            ),
            "ClockTolerance" => new SettingsProperty(
                2,
                "int",
                null,
                "Value set to N means that codes starting from N * 30sec ago to N * 30sec from now are accepted",
            ),
            "AllowBackupCodes" => new SettingsProperty(
                true,
                "bool",
                null,
                "If set to true, and if authenticator app or security key configured, users are able to use backup codes",
            ),
            "AllowUsedDevices" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables managing trusted devices",
            ),
            "TrustDevicesForDays" => new SettingsProperty(
                0,
                "int",
                null,
                "Allows for expiry of trusted device list entries after certain amount of days; if set to 0, managing trusted devices is disabled.",
            ),
            "IncludeInMobile" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, the module is used in mobile version of the interface",
            ),
            "IncludeInDesktop" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, the module is used in desktop version of the interface",
            ),
            "RequireInMobile" => new SettingsProperty(
                [
                    "StandardLoginFormWebclient"
                ],
                "array",
                null,
                "List of other modules required by this module",
            ),
        ];
    }
}
