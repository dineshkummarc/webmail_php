<?php

	defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/'));
	include_once WM_ROOTPATH.'application/include.php';
	$oSettings =& CApi::GetSettings();
	
	if ($oSettings->GetConf('WebMail/UseCaptcha'))
	{
		require WM_ROOTPATH.'libraries/kcaptcha/kcaptcha.php';

		$captcha = new KCAPTCHA();
		if (CGet::Has('PHPWEBMAILSESSID'))
		{
			CSession::Set('captcha_keystring', $captcha->getKeyString());
		}
	}
