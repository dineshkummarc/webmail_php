<?php
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;

require_once "../system/autoload.php";
\Aurora\System\Api::Init(true);

$sPassword = "";

set_time_limit(0);

if (!(isset($_GET['pass']) && $sPassword !== '' && $sPassword === $_GET['pass'])) {
    exit("Migration script password is incorrect or not set.");
}

class P8ToP9Migration
{
    
    public function Init()
    {
    }
    
    public function Start()
    {
        try {
            $container = \Aurora\Api::GetContainer();
            $container['console']->setAutoExit(false);

            $output = new BufferedOutput();

            $container['console']->find('migrate:eav-to-sql')
                ->run(new ArrayInput([
                    '--no-interaction'=>true,
                    '--wipe'=>!!$_GET['wipe'],
                    '--quiet'=>!!$_GET['quiet'],
                    '--migrate-file'=>!!$_GET['migrate-file'],
                ]), $output);

            $content = array_filter(explode(PHP_EOL, $output->fetch()));
            dd($content);
        } catch (\Exception $oEx) {
            dd($oEx);
            \Aurora\System\Api::LogException($oEx);
        }
    }

}
ob_start();
$oMigration = new P8ToP9Migration();
$oMigration->Start();
ob_end_flush();
exit("Done");
