<?php

	defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/../'));

//	api
	include_once WM_ROOTPATH.'libraries/afterlogic/api.php';

//	base
	include_once WM_ROOTPATH.'application/constants.php';
	include_once WM_ROOTPATH.'application/functions.php';
	
	CSession::$sSessionName = 'PHPWEBMAILSESSID';
