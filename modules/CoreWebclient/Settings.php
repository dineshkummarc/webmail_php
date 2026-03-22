<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\CoreWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $AllowChangeSettings
 * @property bool $AllowClientDebug
 * @property bool $AllowDesktopNotifications
 * @property bool $AllowIosProfile
 * @property bool $AllowMobile
 * @property bool $AllowPrefetch
 * @property int $AttachmentSizeLimit
 * @property int $AutoRefreshIntervalMinutes
 * @property string $ContentSecurityPolicy
 * @property string $CustomLogoutUrl
 * @property bool $Disabled
 * @property string $DefaultAnonymScreenHash
 * @property string $DefaultUserScreenHash
 * @property string $GoogleAnalyticsAccount
 * @property array $HeaderModulesOrder
 * @property bool $IsDemo
 * @property array $LanguageNames
 * @property int $MultipleFilesUploadLimit
 * @property bool $ShowQuotaBar
 * @property bool $ShowQuotaBarTextAsTooltip
 * @property int $QuotaWarningPerc
 * @property bool $SyncIosAfterLogin
 * @property string $Theme
 * @property array $ThemeList
 * @property bool $HideLogout
 * @property bool $IncludeInMobile
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
            "AllowChangeSettings" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, users are allowed to select theme, language etc. in common settings screen",
            ),
            "AllowClientDebug" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables clientside debug logs, viewed by entering window.auroraLogs in browser console",
            ),
            "AllowDesktopNotifications" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables desktop notifications, the value is applied to new user accounts",
            ),
            "AllowIosProfile" => new SettingsProperty(
                true,
                "bool",
                null,
                "Enables retrieving account profile download when logging into web interface from iOS device",
            ),
            "AllowMobile" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables mobile version of web interface and automatically switches to it on Android or iOS smartphone",
            ),
            "AllowPrefetch" => new SettingsProperty(
                true,
                "bool",
                null,
                "Enables downloading message bodies in background, to display messages instantly upon selecting those",
            ),
            "AttachmentSizeLimit" => new SettingsProperty(
                0,
                "int",
                null,
                "Attachment file size limit for upload, in bytes",
            ),
            "AutoRefreshIntervalMinutes" => new SettingsProperty(
                1,
                "int",
                null,
                "Default value for auto refresh interval in minutes",
            ),
            "ContentSecurityPolicy" => new SettingsProperty(
                "",
                "string",
                null,
                "Specifies CSP header used for protection from cross-site scripting, clickjacking, code injection attacks",
            ),
            "CustomLogoutUrl" => new SettingsProperty(
                "",
                "string",
                null,
                "Specifies URL user will be redirected to upon logging out of their account",
            ),
            "DefaultAnonymScreenHash" => new SettingsProperty(
                "login",
                "string",
                null,
                "Hash ID of the screen available to non-logged in user by default",
            ),
            "DefaultUserScreenHash" => new SettingsProperty(
                "",
                "string",
                null,
                "Hash ID of the screen available to logged in user by default",
            ),
            "GoogleAnalyticsAccount" => new SettingsProperty(
                "",
                "string",
                null,
                "If specified, Google Analytics code will be loaded with this account ID used",
            ),
            "HeaderModulesOrder" => new SettingsProperty(
                [],
                "array",
                null,
                "Denotes the list of top menu items in the order how they're displayed",
            ),
            "IsDemo" => new SettingsProperty(
                false,
                "bool",
                null,
                "Enables warnings of demo limitations, used by various modules",
            ),
            "LanguageNames" => new SettingsProperty(
                [

                    "Arabic" => "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
                    "Bulgarian" => "\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438",
                    "Chinese-Simplified" => "\u4e2d\u6587(\u7b80\u4f53)",
                    "Chinese-Traditional" => "\u4e2d\u6587(\u9999\u6e2f)",
                    "Czech" => "\u010ce\u0161tina",
                    "Danish" => "Dansk",
                    "Dutch" => "Nederlands",
                    "English" => "English",
                    "Estonian" => "eesti",
                    "Finnish" => "Suomi",
                    "French" => "Fran\u00e7ais",
                    "German" => "Deutsch",
                    "Greek" => "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac",
                    "Hebrew" => "\u05e2\u05d1\u05e8\u05d9\u05ea",
                    "Hungarian" => "Magyar",
                    "Italian" => "Italiano",
                    "Japanese" => "\u65e5\u672c\u8a9e",
                    "Korean" => "\ud55c\uad6d\uc5b4",
                    "Latvian" => "Latvie\u0161u",
                    "Lithuanian" => "Lietuvi\u0173",
                    "Norwegian" => "Norsk",
                    "Persian" => "\u0641\u0627\u0631\u0633\u06cc",
                    "Polish" => "Polski",
                    "Portuguese-Portuguese" => "Portugu\u00eas",
                    "Portuguese-Brazil" => "Portugu\u00eas Brasileiro",
                    "Romanian" => "Rom\u00e2n\u0103",
                    "Russian" => "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
                    "Serbian" => "Srpski",
                    "Slovenian" => "Sloven\u0161\u010dina",
                    "Spanish" => "Espa\u00f1ol",
                    "Swedish" => "Svenska",
                    "Thai" => "\u0e20\u0e32\u0e29\u0e32\u0e44\u0e17\u0e22",
                    "Turkish" => "T\u00fcrk\u00e7e",
                    "Ukrainian" => "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430",
                    "Vietnamese" => "ti\u1ebfng Vi\u1ec7t"
                ],
                "array",
                null,
                "Mapping of language names and their local translations",
            ),
            "MultipleFilesUploadLimit" => new SettingsProperty(
                50,
                "int",
                null,
                "Defines a limit for number of files uploaded during a single user request",
            ),
            "ShowQuotaBar" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, indicator of disk space usage by email or files will be displayed in the interface",
            ),
            "ShowQuotaBarTextAsTooltip" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, quota information will only be shown as the tooltip of the indicator; if false, it's shown directly in the interface",
            ),
            "QuotaWarningPerc" => new SettingsProperty(
                0,
                "int",
                null,
                "Enables warning if percentage of free disk space for email account is less than this value",
            ),
            "SyncIosAfterLogin" => new SettingsProperty(
                true,
                "bool",
                null,
                "",
            ),
            "Theme" => new SettingsProperty(
                "Default",
                "string",
                null,
                "Theme used by default",
            ),
            "ThemeList" => new SettingsProperty(
                [
                    "Default"
                ],
                "array",
                null,
                "List of themes available",
            ),
            "HideLogout" => new SettingsProperty(
                false,
                "bool",
                null,
                "If true, Logout link will be hidden",
            ),
            "IncludeInMobile" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, the module is used in mobile version of the interface",
            ),
        ];
    }
}
