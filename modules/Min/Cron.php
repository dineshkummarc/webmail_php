<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\Min;

use Aurora\Api;

require_once \dirname(__file__) . '/../../system/autoload.php';
\Aurora\System\Api::Init(true);

function Execute()
{
    \Aurora\System\Api::Log('---------- Start remove expired hashes cron script', \Aurora\System\Enums\LogLevel::Full, 'cron-');

    try {
        /** @var \Aurora\Modules\Min\Module $minDecorator */
        $minDecorator = Api::GetModuleDecorator('Min');
        if ($minDecorator) {
            $minDecorator->DeleteExpiredHashes(\time());
        }
    } catch(\Exception $e) {
        \Aurora\System\Api::Log('Error during remove expired hashes cron script execution. ', \Aurora\System\Enums\LogLevel::Full, 'cron-');
        \Aurora\System\Api::LogException($e, \Aurora\System\Enums\LogLevel::Full, 'cron-');
    }

    \Aurora\System\Api::Log('---------- End remove expired hashes cron script', \Aurora\System\Enums\LogLevel::Full, 'cron-');
}

$iTimer = microtime(true);

Api::skipCheckUserRole(true);
Execute();
Api::skipCheckUserRole(false);

\Aurora\System\Api::Log('Cron remove expired hashes execution time: ' . (microtime(true) - $iTimer) . ' sec.', \Aurora\System\Enums\LogLevel::Full, 'cron-');
