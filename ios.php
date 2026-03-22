<?php

defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/'));
require_once WM_ROOTPATH.'application/include.php';

if (CGet::Has('profile'))
{
	/* @var $oApiIosManager CApiIosManager */
	$oApiIosManager = CApi::Manager('ios');

	header('Content-type: application/x-apple-aspen-config; chatset=utf-8');
	header('Content-Disposition: attachment; filename="afterlogic.mobileconfig"');
	echo $oApiIosManager->GenerateXMLProfile();
}
else
{
	$iAccountId = CSession::Get(APP_SESSION_ACCOUNT_ID, false);
	if (false === $iAccountId)
	{
		CApi::Location('index.php?error=1');
		exit();
	}

	/* @var $oAccount CAccount */
	$oAccount = AppGetAccount($iAccountId);
	if (!$oAccount)
	{
		CApi::Location('index.php?error=2');
		exit();
	}
	
	AppIncludeLanguage($oAccount->User->DefaultLanguage);
	
	$sTitle = $oAccount->Domain->SiteName;
	if (!empty($sTitle))
	{
		$sTitle .= ' - '.IOSLoginHeadTitle;
	}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
	<meta content="width=320; initial-scale=0.8; maximum-scale=1.0; user-scalable=0;" name="viewport">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><?php echo $sTitle; ?></title>
	<link rel="shortcut icon" href="./favicon.ico" />
	<script type="text/javascript" src="js/common/common-helpers.js"></script>
	<style>
		body, html {
			height: 100%;
			padding: 0px;
			margin: 0px;
		}
		body { 
			background: #f4f6f8;
			color: #535C68;
			font: normal 14px Tahoma, Arial, Helvetica, sans-serif;
		}
		p {
			margin: 0px 0px 16px;
		}
		h1 {
			font: normal 20px Tahoma, Arial, Helvetica, sans-serif;
		}
		
		label {
			cursor: pointer;
		}
		.wm_content {
			padding: 0px;
			text-align: center;
			width: 320px;
			margin: 0px auto;
			display: table;
			height: 100%;
		}
		.wm_content div {
			display: table-cell;
			vertical-align: middle;
		}
		
		.apple_icon {
			vertical-align: top;
		}
		
		.wm_button_link {
			background: url("./skins/button.png") no-repeat right 0px;
			display: inline-block;
			margin: 4px 0px 16px 6px;
		}
		.wm_button_link span {
			background: url("./skins/button.png") no-repeat left 0px;
			font: bold 14px/22px Verdana,sans-serif;
			color: #525762;
			display: inline-block;
			height: 32px;
			padding: 8px 10px 0 16px;
			position: relative;
			left: -6px;
		}
		.wm_button_link:hover {
			background-position: right -40px;
		}
		.wm_button_link span:hover {
			background-position: left -40px;
		}
	</style>
</head>
<body>
<div class="wm_content">
	<div>
		<h1><?php echo IOSLoginHelloAppleTitle; ?> <img class="apple_icon" src="./skins/apple-icon.png"/> !</h1>
		<p><?php echo IOSLoginHelpDesc1; ?></p>
		<p><?php echo IOSLoginHelpDesc2; ?><br /><?php echo IOSLoginHelpDesc3; ?></p>
		<p>
			<a class="wm_button_link" href="ios.php?profile"><span><?php echo IOSLoginButtonYesPlease; ?></span></a>
			<a id="go-login" onclick="Cookies.create('awm_skip_profile', '1', 365);" class="wm_button_link" href="webmail.php?check=1"><span><?php echo IOSLoginButtonSkip; ?></span></a>
		</p>
	</div>
</div>
</body>
</html>
<?php 

}
