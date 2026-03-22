<?php

	defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/../'));

	/**
	 * @param api_Http $oInput 
	 */
	function RestoreAccountSessionFromAutoload($oInput, $bIndex = true, $bAjax = false)
	{
		$iAccountId = CSession::Get(APP_SESSION_ACCOUNT_ID, false);
		if (false === $iAccountId)
		{
			$iAwmAutoLoginId = $oInput->GetCookie('awm_autologin_id', false);
			$iAwmAutoLoginSubId = $oInput->GetCookie('awm_autologin_subid', false);
			$sAwmAutoLoginData = $oInput->GetCookie('awm_autologin_data', false);

			if (false !== $sAwmAutoLoginData && false !== $iAwmAutoLoginId
//				&& null === $oInput->GetCookie('awm_cookie_autologin', null)
			)
			{
				$oAccount = null;
				if (false !== $iAwmAutoLoginSubId && (int) $iAwmAutoLoginId !== (int) $iAwmAutoLoginSubId)
				{
					$oDefAccount = AppGetAccount($iAwmAutoLoginId);
					$oAccount = AppGetAccount($iAwmAutoLoginSubId);
					if (!$oDefAccount || !$oAccount || $oDefAccount->IdUser !== $oAccount->IdUser)
					{
						$oAccount = null;
					}
					
					$oDefAccount = null;
				}
				else
				{
					$oAccount = AppGetAccount($iAwmAutoLoginId);
				}
				
				if ($oAccount && $sAwmAutoLoginData === md5(md5('AwM'.api_Utils::EncodePassword($oAccount->IncomingMailPassword))))
				{
					/* @var $oApiWebmailManager CApiWebmailManager */
					$oApiWebmailManager = CApi::Manager('webmail');
					
					$aConnectErrors = array(false, false);
					if ($oApiWebmailManager->TestConnectionWithMailServer($aConnectErrors,
						$oAccount->IncomingMailProtocol, $oAccount->IncomingMailLogin, $oAccount->IncomingMailPassword,
						$oAccount->IncomingMailServer, $oAccount->IncomingMailPort, $oAccount->IncomingMailUseSSL))
					{
						$oAccount->FillSession();
//						@setcookie('awm_cookie_autologin', '1', 0);
						if (!$bAjax)
						{
							$oApiWebmailManager->JumpToWebMail('webmail.php?check=1');
							exit();
						}
					}
					else
					{
						if (!$bIndex && !$bAjax)
						{
							CApi::Location('index.php');
							exit();
						}
					}
				}
			}
			else
			{
				if (!$bIndex && !$bAjax)
				{
//					$bCookieCheck = (bool) (isset($_COOKIE['awm_cookie_sess_check']) && 1 === (int) $_COOKIE['awm_cookie_sess_check']);
//					@setcookie('awm_cookie_sess_check', '', time() - 360010);
//					CApi::Location(($bCookieCheck) ? 'index.php?error=1' : 'index.php');
					CApi::Location('index.php?error=1');
					exit();
				}
			}
		}
		else if ($bIndex)
		{
			$oAccount = AppGetAccount($iAccountId);
			if ($oAccount)
			{
				/* @var $oApiWebmailManager CApiWebmailManager */
				$oApiWebmailManager = CApi::Manager('webmail');
				$oApiWebmailManager->JumpToWebMail('webmail.php?check=1');
			}
		}
	}
	
	/**
	 * @staticvar bool $bOnceRun
	 * @param string $sLanguageName
	 */
	function AppIncludeLanguage($sLanguageName)
	{
		static $bOnceRun = false;
		if (!$bOnceRun)
		{
			$bOnceRun = true;

			if (!$sLanguageName || !preg_match('/^[a-zA-Z0-9\-]+$/', $sLanguageName) ||
				!@file_exists(WM_ROOTPATH.'lang/'.$sLanguageName.'.php'))
			{
				$oSettings =& CApi::GetSettings();
				$sLanguageName = $oSettings->GetConf('Common/DefaultLanguage');
				$sLanguageName = @file_exists(WM_ROOTPATH.'lang/'.$sLanguageName.'.php')
					? $sLanguageName: 'English';
			}

			include_once WM_ROOTPATH.'lang/'.$sLanguageName.'.php';
		}
	}

	/**
	 * @return bool
	 */
	function IsAdminLogin()
	{
		return (bool) CSession::Get(EAccountSessKey::AdminLogin, false);
	}

	/**
	 * @param CAccount $oAccount
	 * @return CDomain
	 */
	function AppGetDomain($oAccount = null)
	{
		if ($oAccount)
		{
			return $oAccount->Domain;
		}

		/* @var $oApiDomainsManager CApiDomainsManager */
		$oApiDomainsManager = CApi::Manager('domains');
		
		$oInput = new api_Http();
		return $oApiDomainsManager->GetDomainByUrl($oInput->GetHost());
	}

	/**
	 * @param int $iAccountId
	 * @return CAccount
	 */
	function AppGetAccount($iAccountId)
	{
		/* @var $oApiUsersManager CApiUsersManager */
		$oApiUsersManager = CApi::Manager('users');
		return $oApiUsersManager->GetAccountById($iAccountId);
	}

	/**
	 * @param CAccount $oAccount
	 * @param int $iSessionUserId = null
	 * @return array
	 */
	function AppGetAccounts($oAccount, $iSessionUserId = null)
	{
		$iUserId = (null !== $oAccount)
			? $oAccount->IdUser : $iSessionUserId;

		$aAccounts = array();

		if (null !== $iUserId)
		{
			/* @var $oApiUsersManager CApiUsersManager */
			$oApiUsersManager = CApi::Manager('users');
			$aAccountsIds = $oApiUsersManager->GetUserIdList($iUserId);

			if (is_array($aAccountsIds))
			{
				foreach ($aAccountsIds as $iAccountId)
				{
					if (null === $oAccount)
					{
						$aAccounts[$iAccountId] = AppGetAccount($iAccountId);
					}
					else
					{
						$aAccounts[$iAccountId] = ($iAccountId === $oAccount->IdAccount)
							? $oAccount : AppGetAccount($iAccountId);
					}

					if (!is_object($aAccounts[$iAccountId]))
					{
						unset($aAccounts[$iAccountId]);
					}
				}
			}
		}

		return $aAccounts;
	}
	
	if (!function_exists('json_encode'))
	{
		include_once WM_ROOTPATH.'libraries/other/json.php';
		
		/**
		 * @staticvar Services_JSON $json
		 * @return &Services_JSON
		 */
		function &getServicesJSON()
		{
			static $json = null;
			if (null === $json)
			{
				$json = new Services_JSON();
			}
			
			return $json;
		}
		
		/**
		 * @param mixed $val
		 * @return string 
		 */
		function json_encode($val)
		{
			$json =& getServicesJSON();
			return $json ? $json->encode($val) : '';
		}
		
		/**
		 * @param string $val
		 * @return mixed 
		 */
		function json_decode($val)
		{
			$json =& getServicesJSON();
			return $json ? $json->decode($val) : null;
		}
		
		if (!function_exists('json_last_error'))
		{
			/**
			 * @return int
			 */
			function json_last_error()
			{
				return 0;
			}
		}
	}
