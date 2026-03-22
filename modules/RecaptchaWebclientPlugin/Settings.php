<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\RecaptchaWebclientPlugin;

use Aurora\System\SettingsProperty;
use Aurora\Modules\RecaptchaWebclientPlugin\Enums;

/**
 * @property bool $Disabled
 * @property string $PublicKey
 * @property string $PrivateKey
 * @property int $LimitCount
 * @property array $WhitelistIPs
 * @property bool $IncludeInMobile
 * @property bool $IncludeInDesktop
 * @property string $RequestMethod
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
            "PublicKey" => new SettingsProperty(
                "",
                "string",
                null,
                "Public key obtained at reCAPTCHA website",
            ),
            "PrivateKey" => new SettingsProperty(
                "",
                "string",
                null,
                "Private key obtained at reCAPTCHA website",
            ),
            "LimitCount" => new SettingsProperty(
                0,
                "int",
                null,
                "Denotes number of unsuccessful login attempts required for CAPTCHA to be displayed, 0 - always displayed",
            ),
            "WhitelistIPs" => new SettingsProperty(
                [],
                "array",
                null,
                "List of IP addresses CAPTCHA is never be displayed for",
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
            "RequestMethod" => new SettingsProperty(
                Enums\RequestMethods::SocketPost,
                "spec",
                Enums\RequestMethods::class,
                "Request method used by API",
            ),
        ];
    }
}
