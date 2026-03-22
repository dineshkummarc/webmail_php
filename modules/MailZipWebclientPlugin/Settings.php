<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailZipWebclientPlugin;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property int $ExpandZipFilesLimit
 * @property bool $IncludeInMobile
 * @property array $AvailableFor
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
            "ExpandZipFilesLimit" => new SettingsProperty(
                500,
                "int",
                null,
                "Sets a limit for number of files shown when expanding ZIP archive",
            ),
            "IncludeInMobile" => new SettingsProperty(
                true,
                "bool",
                null,
                "If true, the module is used in mobile version of the interface",
            ),
            "AvailableFor" => new SettingsProperty(
                [
                    "MailWebclient"
                ],
                "array",
                null,
                "Automatically provide this feature if one of the listed modules is requested by the entry point",
            ),
        ];
    }
}
