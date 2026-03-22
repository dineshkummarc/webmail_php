<?php

if (PHP_SAPI !== 'cli') {
    exit("Use the console for running this script");
}

include_once '../system/autoload.php';

use Aurora\Api;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\SingleCommandApplication;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Helper\ProgressBar;
use Illuminate\Database\Capsule\Manager as Capsule;

Api::Init();

abstract class Enums
{
    public const file = 1;
    public const console = 2;
    public const both = 3;
}
function logMessage($output, $message, $mode = Enums::both) {
    if ($mode === Enums::console || $mode === Enums::both) {
        $output->writeln($message);
    }
    if ($mode === Enums::file || $mode === Enums::both) {
        Api::Log($message, \Aurora\System\Enums\LogLevel::Full, 'update-encryption-key-');
    }
}

function logObjectResults($output, $data, $title) {
    logMessage($output, "  $title:");
    foreach ($data as $propName => $ids) {
        logMessage($output, "    Property: $propName");
        logMessage($output, "    Ids: " . implode(', ', $ids));
    }
    logMessage($output, "");
}

function updateEncryptedProp($class, $shortClassName, $propNames, $oldEncryptionKey, $newEncryptionKey, $count, $output) {
    $progressBar = new ProgressBar($output, $count);
    $progressBar->setFormat('verbose');
    $progressBar->setBarCharacter('<info>=</info>');

    $progressBar->start();
    $aObjectResults= [
        'missing' => [],
        'updated' => [],
        'error' => [],
        'empty' => [],
    ];

    foreach ($propNames as $propName) {
        $aObjectResults['missing'][$propName] = [];
        $aObjectResults['updated'][$propName] = [];
        $aObjectResults['error'][$propName] = [];
        $aObjectResults['empty'][$propName] = [];
    }

    $class::where('Properties->EncryptionKeyIsUpdated', false)->orWhere('Properties->EncryptionKeyIsUpdated', null)->chunk(10000, function ($items) use ($propNames, $oldEncryptionKey, $newEncryptionKey, $progressBar, &$aObjectResults, $output) {
        foreach ($items as $item) {
            $bObjectError = false;
            foreach ($propNames as $propName) {
                if (strpos($propName, '::') !== false) {
                    $propValue = $item->getExtendedProp($propName);

                    $decryptedValue = \Aurora\System\Utils::DecryptValue($propValue);
                            
                    if ($decryptedValue) {
                        Api::$sEncryptionKey = $newEncryptionKey;
                        $item->setExtendedProp($propName, \Aurora\System\Utils::EncryptValue($decryptedValue));
                        //store updated item id
                        $aObjectResults['updated'][$propName][] = $item->Id;
                    } else {
                        //store failed item id
                        $bObjectError = true;
                        $aObjectResults['error'][$propName][] = $item->Id;
                    }
                } else {
                    $rawValue = trim($item->getRawOriginal($propName));
                    if ($rawValue !== '') {
                        Api::$sEncryptionKey = $oldEncryptionKey;
                    
                        // Most of model properties are decrypted automatically when they are read.
                        $propValue = $item->{$propName};
    
                        if ($propValue) {
                            Api::$sEncryptionKey = $newEncryptionKey;
                            $item->{$propName} = $propValue;
                            //store updated item id
                            $aObjectResults['updated'][$propName][] = $item->Id;
                        } elseif ($propValue === false || $rawValue !== '' && trim($propValue) === '') {
                            // false means decryption error, but currently auto encrypted fields return empty strings when value cannot be decrypted
                            $bObjectError = true;
                            $aObjectResults['error'][$propName][] = $item->Id;
                        } elseif ($propValue === null) {
                            $aObjectResults['missing'][$propName][] = $item->Id;
                        } elseif (trim($propValue) === '') {
                            $aObjectResults['empty'][$propName][] = $item->Id;
                        }
                    } else {
                        $aObjectResults['empty'][$propName][] = $item->Id;
                    }
                }
            }

            // $item->setExtendedProp('EncryptionKeyIsUpdated', !$bObjectError);
            logMessage($output, "EncryptionKeyIsUpdated: $item->Id: " . (!$bObjectError ? "true" : "false"));
            if ($item->save()) {
                $progressBar->advance();
            } else {
                logMessage($output, "Object saving error: $item->getName(): $item->Id");
            }
        }
    });

    $progressBar->finish();
    logMessage($output, "");
    logMessage($output, "'$shortClassName' objects updating results:");

    logObjectResults($output, $aObjectResults['updated'], "Updated");
    logObjectResults($output, $aObjectResults['error'], "Errors");
    logObjectResults($output, $aObjectResults['missing'], "Missing");
    logObjectResults($output, $aObjectResults['empty'], "Empty");
}

function updateEncryptedConfig($moduleName, $configName, $oldEncryptionKey, $newEncryptionKey, $output) {
    if (Api::$oModuleManager->isModuleLoaded($moduleName)) {

        logMessage($output, "Processing $moduleName->$configName: ");

        $configValue = Api::$oModuleManager->getModuleConfigValue($moduleName, $configName);
        if ($configValue) {
            Api::$sEncryptionKey = $oldEncryptionKey;
            $value = \Aurora\System\Utils::DecryptValue($configValue);

            if ($value) {
                Api::$sEncryptionKey = $newEncryptionKey;
                $value = \Aurora\System\Utils::EncryptValue($value);
                Api::$oModuleManager->setModuleConfigValue($moduleName, $configName, $value);
                Api::$oModuleManager->saveModuleConfigValue($moduleName);

                logMessage($output, "Config file updated");
            } else {
                logMessage($output, "Can't decrypt config value");
            }
        } else {
            logMessage($output, "Config value not found");
        }
    }
}

function processObject($class, $props, $oldEncryptionKey, $newEncryptionKey, $input, $output, $helper, $force) {

    $classParts = explode('\\', $class);
    $shortClassName = end($classParts);

    logMessage($output, "Processing $class objects");

    if (class_exists($class)) {
        $classTablename = with(new $class)->getTable();
        if (Capsule::schema()->hasTable($classTablename)) {
            if ($force) {
                $class::where('Properties->EncryptionKeyIsUpdated', true)->update(['Properties->EncryptionKeyIsUpdated' => false]);
            }

            $allObjectsCount = $class::count();
            $objectsCount = $class::where('Properties->EncryptionKeyIsUpdated', false)->orWhere('Properties->EncryptionKeyIsUpdated', null)->count();

            logMessage($output, $allObjectsCount . ' object(s) found, ' . $objectsCount . ' of them have not yet been updated');
            if ($objectsCount > 0) {
                $question = new ConfirmationQuestion('Update encrypted properties for them? [yes]', true);
                if ($helper->ask($input, $output, $question)) {
                    updateEncryptedProp($class, $shortClassName, $props, $oldEncryptionKey, $newEncryptionKey, $objectsCount, $output);
                }
            } else {
                logMessage($output, 'No objects found');
            }
        } else {
            logMessage($output, "$classTablename table not found");
        }
    } else {
        logMessage($output, "$shortClassName class not found");
    }
}

(new SingleCommandApplication())
    ->setName('Update encryption key script') // Optional
    ->setVersion('1.0.0') // Optional
    ->addArgument('force', InputArgument::OPTIONAL, 'Force reset EncryptionKeyIsUpdated flag for all objects')
    ->setCode(function (InputInterface $input, OutputInterface $output) {
        $helper = $this->getHelper('question');
        $force = $input->getArgument('force');

        $encryptionKeyPath = Api::GetEncryptionKeyPath();
        $pathInfo = pathinfo($encryptionKeyPath);
        $bakEncryptionKeyPath = $pathInfo['dirname'] . '/' . $pathInfo['filename'] . '.bak.' . $pathInfo['extension'];

        if (file_exists($bakEncryptionKeyPath)) {
            $newEncryptionKey = Api::$sEncryptionKey;
            include $bakEncryptionKeyPath;
            $oldEncryptionKey = Api::$sEncryptionKey;
            include(Api::GetEncryptionKeyPath());
        } elseif (file_exists($encryptionKeyPath)) {
            $oldEncryptionKey = Api::$sEncryptionKey;

            $systemUser = fileowner($encryptionKeyPath);
            $systemUser = (is_numeric($systemUser) && function_exists('posix_getpwuid')) ? posix_getpwuid($systemUser)['name'] : $systemUser;
            $question = new Question('Please enter the owner name for the new encryption key file [' . $systemUser . ']:', $systemUser);
            $systemUser = $helper->ask($input, $output, $question);

            rename($encryptionKeyPath, $bakEncryptionKeyPath);
            Api::InitEncryptionKey();
            if ($systemUser !== '') {
                chown($encryptionKeyPath, $systemUser);
            }
            include($encryptionKeyPath);
            $newEncryptionKey = Api::$sEncryptionKey;
        } else {
            logMessage($output, 'Encryption key file not found');
        }

        logMessage($output, "Old encryption key: $oldEncryptionKey", Enums::console);
        logMessage($output, "New encryption key: $newEncryptionKey", Enums::console);
        logMessage($output, "");

        // update encrypted data for classes
        $objects = [
            "\Aurora\Modules\Mail\Models\MailAccount" => ['IncomingPassword'],
            "\Aurora\Modules\Mail\Models\Fetcher" => ['IncomingPassword'],
            "\Aurora\Modules\Mail\Models\Server" => ['SmtpPassword'],
            "\Aurora\Modules\StandardAuth\Models\Account" => ['Password'],
            "\Aurora\Modules\Core\Models\User" => ['TwoFactorAuth::BackupCodes', 'TwoFactorAuth::Secret', 'IframeAppWebclient::Password']
        ];

        foreach ($objects as $class => $props) {
            processObject($class, $props, $oldEncryptionKey, $newEncryptionKey, $input, $output, $helper, $force);
            logMessage($output, "");
        }

        // update encrypted data in configs
        $question = new ConfirmationQuestion('Update encrypted data in config files? [no]', false);
        if ($helper->ask($input, $output, $question)) {
            $settings = [
                'CpanelIntegrator' => 'CpanelPassword',
                'LdapChangePasswordPlugin' => 'BindPassword',
                'MailChangePasswordFastpanelPlugin' => 'FastpanelAdminPass',
                'MailChangePasswordHmailserverPlugin' => 'AdminPass',
                'MailChangePasswordIredmailPlugin' => 'DbPass',
                'MailChangePasswordIspconfigPlugin' => 'DbPass',
                'MailChangePasswordIspmanagerPlugin' => 'ISPmanagerPass',
                'MailChangePasswordVirtualminPlugin' => 'VirtualminAdminPass',
                'MailSignupDirectadmin' => 'AdminPassword',
                'MailSignupFastpanel' => 'FastpanelAdminPass',
                'MailSignupPlesk' => 'PleskAdminPassword',
                'RocketChatWebclient' => 'AdminPassword',
                'StandardResetPassword' => 'NotificationPassword',
                'TeamContactsLdap' => 'BindPassword',
            ];

            foreach ($settings as $moduleName => $configName) {
                updateEncryptedConfig($moduleName, $configName, $oldEncryptionKey, $newEncryptionKey, $output);
            }
            logMessage($output, "");
        }

        if (file_exists($bakEncryptionKeyPath)) {
            $question = new ConfirmationQuestion('Remove backup encryption key file? [no]', false);
            if ($helper->ask($input, $output, $question)) {
                unlink($bakEncryptionKeyPath);
                logMessage($output, "");
            }
        }

        $question = new ConfirmationQuestion('Update superadmin password? [no]', false);
        if ($helper->ask($input, $output, $question)) {
            $oSettings = &Api::GetSettings();
            $sSuperadminPassword = '';
            $question = new Question('Please enter the new superadmin password: ', $sSuperadminPassword);
            $question->setHidden(true)->setHiddenFallback(false);
            $sSuperadminPassword = $helper->ask($input, $output, $question);
            $oSettings->AdminPassword = password_hash(trim($sSuperadminPassword), PASSWORD_BCRYPT);

            if ($oSettings->Save()) {
                logMessage($output, 'Superadmin password was set successfully!');
            } else {
                logMessage($output, 'Can\'t save superadmin password.');
            }
        }
    })->run();