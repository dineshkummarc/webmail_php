<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\LogsViewerWebclient;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property int $ViewLastLogSize
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
            "ViewLastLogSize" => new SettingsProperty(
                1024000,
                "int",
                null,
                "Defines size of the log file section to view, in bytes",
            ),
        ];
    }
}
