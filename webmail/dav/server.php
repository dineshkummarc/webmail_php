<?php

defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/../'));

require_once WM_ROOTPATH.'libraries/afterlogic/DAV/autoload.php';

$server = new afterlogic_DAV_Server();
$server->exec();
