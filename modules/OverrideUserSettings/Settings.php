<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\OverrideUserSettings;

use Aurora\System\SettingsProperty;

/**
 * @property bool $Disabled
 * @property array $Domains
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
            "Domains" => new SettingsProperty(
                [],
                "array",
                null,
                "Defines a list of domains, with a list of features disabled for each of those domains",
            ),
        ];
    }
}
