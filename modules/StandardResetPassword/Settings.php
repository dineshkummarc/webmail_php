<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\StandardResetPassword;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property bool $IncludeInMobile
 * @property string $HashModuleName
 * @property int $RecoveryLinkLifetimeMinutes
 * @property string $NotificationType
 * @property string $NotificationEmail
 * @property string $NotificationHost
 * @property int $NotificationPort
 * @property string $NotificationSMTPSecure
 * @property bool $NotificationUseAuth
 * @property string $NotificationLogin
 * @property string $NotificationPassword
 * @property string $CustomLogoUrl
 * @property string $BottomInfoHtmlText
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
            "IncludeInMobile" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, the module is used in mobile version of the interface",
            ),
            "HashModuleName" => new SettingsProperty(
                "reset-password",
                "string",
                null,
                "Defines URL hash used by the module",
            ),
            "RecoveryLinkLifetimeMinutes" => new SettingsProperty(
                15,
                "int",
                null,
                "Defines lifetime of password reset link, in minutes",
            ),
            "NotificationType" => new SettingsProperty(
                "mail",
                "string",
                null,
                "Denotes how the mail is sent - mail for standard mail() function of PHP, smtp for sending via SMTP protocol",
            ),
            "NotificationEmail" => new SettingsProperty(
                "",
                "string",
                null,
                "Sender email address used in mail messages sent by this module",
            ),
            "NotificationHost" => new SettingsProperty(
                "",
                "string",
                null,
                "SMTP server host used for sending mail by this module",
            ),
            "NotificationPort" => new SettingsProperty(
                25,
                "int",
                null,
                "SMTP server port number",
            ),
            "NotificationSMTPSecure" => new SettingsProperty(
                "",
                "string",
                null,
                "Set to 'ssl' or 'tls' to use SSL or STARTTLS respectively",
            ),
            "NotificationUseAuth" => new SettingsProperty(
                false,
                "bool",
                null,
                "If true, SMTP authentication is used to connect to SMTP server",
            ),
            "NotificationLogin" => new SettingsProperty(
                "",
                "string",
                null,
                "Username used to authenticate on SMTP server",
            ),
            "NotificationPassword" => new SettingsProperty(
                "",
                "string",
                null,
                "Password used to authenticate on SMTP server",
            ),
            "CustomLogoUrl" => new SettingsProperty(
                "",
                "string",
                null,
                "Defines URL of logo image used on password reset page",
            ),
            "BottomInfoHtmlText" => new SettingsProperty(
                "",
                "string",
                null,
                "Defines bottom text message shown on password reset page",
            ),
        ];
    }
}
