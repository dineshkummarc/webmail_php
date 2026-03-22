<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\StandardLoginFormWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property string $ServerModuleName
 * @property string $HashModuleName
 * @property string $CustomLoginUrl
 * @property string $DemoLogin
 * @property string $DemoPassword
 * @property string $InfoText
 * @property string $BottomInfoHtmlText
 * @property int $LoginSignMeType
 * @property bool $AllowChangeLanguage
 * @property bool $UseDropdownLanguagesView
 * @property int $AuthTokenCookieExpireTime
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
            "ServerModuleName" => new SettingsProperty(
                "StandardLoginFormWebclient",
                "string",
                null,
                "Defines name of the module responsible for login page",
            ),
            "HashModuleName" => new SettingsProperty(
                "login",
                "string",
                null,
                "Defines hash of the module responsible for login page",
            ),
            "CustomLoginUrl" => new SettingsProperty(
                "",
                "string",
                null,
                "If specified, user will be directed to login page at this URL instead of default login page",
            ),
            "DemoLogin" => new SettingsProperty(
                "",
                "string",
                null,
                "If set, denotes email address of predefined demo account",
            ),
            "DemoPassword" => new SettingsProperty(
                "",
                "string",
                null,
                "If set, denotes password of predefined demo account",
            ),
            "InfoText" => new SettingsProperty(
                "",
                "string",
                null,
                "Defines additional text message shown on login page",
            ),
            "BottomInfoHtmlText" => new SettingsProperty(
                "",
                "string",
                null,
                "Defines bottom text message shown on login page",
            ),
            "LoginSignMeType" => new SettingsProperty(
                0,
                "int",
                null,
                "",
            ),
            "AllowChangeLanguage" => new SettingsProperty(
                true,
                "bool",
                null,
                "Enables changing language on login page",
            ),
            "UseDropdownLanguagesView" => new SettingsProperty(
                false,
                "bool",
                null,
                "If true, language selector is presented as a dropdown menu",
            ),
            "AuthTokenCookieExpireTime" => new SettingsProperty(
                30,
                "int",
                null,
                "Sets authentication token expiry time, in days",
            ),
        ];
    }
}
