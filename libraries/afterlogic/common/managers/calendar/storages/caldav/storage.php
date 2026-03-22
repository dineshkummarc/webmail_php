<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Calendar
 */

defined('WM_ROOTPATH') || define('WM_ROOTPATH', (dirname(__FILE__).'/../'));

require_once WM_ROOTPATH.'libraries/afterlogic/DAV/autoload.php';

class CApiCalendarCaldavStorage extends CApiCalendarStorage
{
	/**
	 * @var api_Settings
	 */
	protected $Settings;
	
	/**
	 * @var DAVClient $Dav
	 */
	protected $Dav;

	/**
	 * @var string
	 */
	public $CalendarHomeSet;
	
	/**
	 * @var string
	 */
	public $Principal;

	/**
	 * @var string
	 */
	protected $Url;

	/**
	 * @var bool
	 */
	protected $Connected;

	/**
	 * @var string
	 */
	protected $User;
	
	/**
	 * @var string
	 */
	protected $TimeZone;

	/**
	 * @var string
	 */
	protected $DbPrefix;

	/**
	 * @var PDO 
	 */
	protected $Pdo;

	/* 
	 * @var CAccount
	 */
	protected $Account;
	
	/* 
	 * @var $ApiUsersManager CApiUsersManager
	 */
	protected $ApiUsersManager;
	
	/* 
	 * @var $ApiCollaborationManager CApiCollaborationManager 
	 */
	protected $ApiCollaborationManager;

	/* 
	 * @var array
	 */
	protected $CacheUserCalendars;
	
	/* 
	 * @var array
	 */
	protected $CacheSharedCalendars;

	/**
	 * @var CApiDavManager
	 */
	protected $ApiDavManager;

	/**
	 * @param CApiGlobalManager $oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('caldav', $oManager);
		
		CApi::Inc('common.dav.client');
		$this->inc('utils');

		$this->Settings = CApi::GetSettings();
		$this->Dav = null;
		$this->User = null;
		$this->CalendarHomeSet = null;
		$this->Principal = '';
		$this->Url = '';
		$this->Connected = false;
		$this->DbPrefix = $this->Settings->GetConf('Common/DBPrefix');
		$this->Pdo = CApi::GetPDO();
		$this->Account = null;
		
		$this->ApiUsersManager = CApi::Manager('users');
		$this->ApiCollaborationManager = CApi::Manager('collaboration');
		$this->ApiDavManager = CApi::Manager('dav');
		
		$this->CacheUserCalendars = array();
		$this->CacheSharedCalendars = array();
	}
	
	/**
	 * @param CAccount $oAccount
	 */
	public function Init($oAccount)
	{
		if (($oAccount != null && $this->Dav == null && ($this->User != $oAccount->Email)) || 
		    ($this->Account->Email != $oAccount->Email))
		{
			$this->Account = $oAccount;
			$this->User = $oAccount->Email;
			$this->TimeZone = $oAccount->GetDefaultStrTimeZone();

			$this->Url = $this->ApiDavManager->GetServerUrl();
			
			$this->Dav = new DAVClient($this->Url, $this->User, $oAccount->IncomingMailPassword);
			
			if ($this->Dav->Connect())
			{
				$this->Connected = true;
				$this->Principal = $this->Dav->GetCurrentPrincipal();
				$this->CalendarHomeSet = $this->Dav->GetCalendarHomeSet($this->Principal);
			}
		}
	}
	
	public function IsConnected()
	{
		return $this->Connected;
	}
	
	/**
	 * @param string $sEmail
	 * @param string $sPassword
	 */
	public function InitByEmail($sEmail, $sPassword='******')
	{
		$oAccount = new CAccount(new CDomain());
		$oAccount->Email = $sEmail;
		$oAccount->IncomingMailPassword = $sPassword;
		
		$this->Init($oAccount);
	}

	/**
	 * @param CalendarInfo  $oCalendar
	 */
	public function InitCalendar(&$oCalendar)
	{
		$oCalendar->Shared = true;
		$sRelativeUsername = '';
		
		$sMainPrincipal = $this->Dav->GetMainPrincipalUrl($oCalendar->Principals[0]);
				
		$sRelativeUsername = basename(urldecode($sMainPrincipal));
		
		list($username, $rubbish) = explode(DAV_EMAIL_DEV, $this->Dav->GetUser());
		if ($sRelativeUsername != '')
		{
			list($sRelativeUsername, $domain) = explode(DAV_EMAIL_DEV, $sRelativeUsername);
		}

		if ((strcmp($sRelativeUsername, $username) != 0) && 
				preg_match('/(.+)-([A-Za-z0-9]{8})/', $sRelativeUsername, $matches))
		{
			$sRelativeUsername = $matches[1];
		}

		if(strcmp($sRelativeUsername, $username) == 0)
		{
			$oCalendar->Shared = false;
			$oCalendar->Owner = $this->Dav->GetUser();
		}
		else
		{
			if($sRelativeUsername != '' && $domain != '')
			{
				$oCalendar->Owner = $sRelativeUsername . '@' . $domain;
			}
			else
			{
				$oCalendar->Owner = $this->Dav->GetUser();
			}
		}	
	}
	
	public function CheckCalendarAccess($sUser, $sCalendarId)
	{
		return 0; //FULL_CONTOL
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function GetCalendar($oAccount, $sCalendarId)
	{
		$this->Init($oAccount);
		
		$aFolders = array();
		if (count($this->CacheUserCalendars) > 0 && 
				isset($this->CacheUserCalendars[$sCalendarId]))
		{
			$aFolders[$sCalendarId] = $this->CacheUserCalendars[$sCalendarId];
		}
		else if (count($this->CacheSharedCalendars) > 0 && 
				isset($this->CacheSharedCalendars[$sCalendarId]))
		{
			$aFolders[$sCalendarId] = $this->CacheSharedCalendars[$sCalendarId];
		}
		else
		{
			$aFolders = $this->Dav->GetCalendars($sCalendarId);
		}
		
		if (count($aFolders) > 0)
		{
			reset($aFolders);
			$result = current($aFolders);
			
			if (count($result->Principals) > 0)
			{
				$result->Principals = array(
					$result->Principals[0].'/calendar-proxy-read',
					$result->Principals[0].'/calendar-proxy-write'
				);
			}			
			$result->Shared = true;
			
			$aCalendarUsers = array();
			if ($this->Dav->isCustomServer)
			{
				$this->InitCalendar($result);
				$aCalendarUsers = $this->GetCalendarUsers($oAccount, $result);
			}		
			
			$sPubLevel = null;
			$sPubHash = null;
			$shares = array();
			
			foreach ($aCalendarUsers as $aCalendarUser)
			{
				if ($aCalendarUser['email'] == $this->GetPublicUser())
				{
					$sPubLevel = '1';
					$sPubHash = $this->GetPublicCalendarHash($oAccount, $sCalendarId);
				}
				else
				{
					$shares[] = array(
						'id_share' => $aCalendarUser['email'], 
						'email_to_user' => $aCalendarUser['email'], 
						'int_access_level' => (int) $aCalendarUser['access_level']
					);
				}
			}
			$result->shares = $shares;
			$result->PubLevel = $sPubLevel;
			$result->PubHash = $sPubHash;
			
			return $result;
		}
		return null;
	}
	
	public function GetPublicUser()
	{
		if (!$this->Pdo)
		{
			throw new CApiBaseException(Errs::Db_PdoExceptionError);
		}
		$principalBackend = new afterlogic_DAV_Principal_Backend_PDO($this->Pdo, $this->DbPrefix);
		return $principalBackend->getOrCreatePublicPrincipal();
	}

	/*
	 * @param string $sCalendar
	 */
	public function GetPublicCalendar($sCalendar)
	{
		$aCalendar = array();
		$this->InitByEmail($this->GetPublicUser());
		
		$oCalendar = $this->GetCalendar($this->Account, $sCalendar);
		if ($oCalendar && $oCalendar->Shared)
		{
			$aCalendar = array(
				'calendar_active' => '1',
				'calendar_color' => CalendarColors::GetColorNumber($oCalendar->Color),
				'calendar_description' => $oCalendar->Description,
				'calendar_id' => $oCalendar->Url,
				'calendar_name' => $oCalendar->DisplayName,
				'ical_hash' => null,
				'publication_hash' => $oCalendar->PubHash,
				'publication_level' => $oCalendar->PubLevel,
				'shares' => array(),
				'sharing_active' => '1',
				'sharing_id' => '1',
				'sharing_level' => $oCalendar->SharingLevel,
				'user_id' => '1'
			);
		}
		return $aCalendar;
	}
	
	/*
	 * @param string $sHash
	 */
	public function GetPublicCalendarByHash($sHash)
	{
		$this->InitByEmail($this->GetPublicUser());
		if ($this->Dav->isCustomServer)
		{
			$sPubCalendar = $this->Dav->GetRootUrl($this->ApiDavManager->GetServerUrl()) . 
					'delegation/'.$sHash.'/calendar/';
			return $this->GetPublicCalendar($sPubCalendar);
		}
		return false;
	}	

	/*
	 * @param string $sCalendarId
	 */
	public function GetPublicCalendarHash($oAccount, $sCalendarId)
	{
		$this->Init($oAccount);
		if ($this->Dav->isCustomServer)
		{
			if (!$this->Pdo)
			{
				throw new CApiBaseException(Errs::Db_PdoExceptionError);
			}
			$calendarPDO = new afterlogic_DAV_CalDAV_Backend_PDO($this->Pdo, $this->DbPrefix);
			$result = $calendarPDO->getCalendarForUser($oAccount->Email, $sCalendarId);
			if ($result)
			{
				return $result[0]['id'];
			}
			else return false;
		}
		return false;
	}	
	
	/**
	 * @param CAccount $oAccount
	 */
	public function GetCalendarObjects($oAccount)
	{
		$this->Init($oAccount);
		
		$aCalendars = array();
		if (count($this->CacheUserCalendars) > 0)
		{
			$aCalendars = $this->CacheUserCalendars;
		}
		else
		{
			$aCalendars = $this->Dav->GetCalendars($this->CalendarHomeSet);
			$this->CacheUserCalendars = $aCalendars;
		}
		return $aCalendars;
	}
	
	/**
	 * @param CAccount $oAccount
	 */
	public function GetCalendarSharedObjects($oAccount)
	{
		$aCalendars = array();

		if ($this->Dav->isCustomServer)
		{
			$proxes = $this->Dav->GetCalendarProxiedFor($this->Principal);		
			foreach ($proxes as $proxy)
			{
				if (count($this->CacheSharedCalendars) > 0)
				{
					$aCalendars = $this->CacheSharedCalendars;
				}
				else
				{
					$aCalendars = $this->Dav->GetCalendars($proxy['href']);
					$this->CacheSharedCalendars = $aCalendars;
				}
						
				foreach ($aCalendars as $oCalendar)
				{
					$oCalendar->SharingLevel = ($proxy['mode'] == 'write' ? 1 : 2);
				}
			}
		}
		else
		{
			$aPrincipals = $this->Dav->GetPrincipalMembers($this->Principal);
			foreach($aPrincipals as $key => $principal)
			{
				$aCalendars = $this->Dav->GetCalendars($key);

				foreach ($aCalendars as $oCalendar)
				{
					$oCalendar->Principals = $principal;
					$oCalendar->Shared = true;
					$oCalendar->Default = false;
					
					if (count($oCalendar->Principals) > 0)
					{
						$sSharingLevel = null;
						if (strpos($oCalendar->Principals[0], 'calendar-proxy-write') !== false)
						{
							$sSharingLevel = '1';
						}
						if (strpos($oCalendar->Principals[0], 'calendar-proxy-read') !== false)
						{
							$sSharingLevel = '2';
						}
						$oCalendar->SharingLevel = $sSharingLevel;
					}
				}
			}
		}
		return $aCalendars;
	}
	
	/**
	}
	 * @param CAccount $oAccount
	 */
	public function GetCalendars($oAccount)
	{
		$this->Init($oAccount);

		$calendars = array();
		$calendars['user'] = array();
		$calendars['shared'] = array();

		$oCalendarsOwn = $this->GetCalendarObjects($oAccount);
		$oCalendarsShared = array();
		if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarSharingSupported())
		{
			$oCalendarsShared = $this->GetCalendarSharedObjects($oAccount);
		}
		$oCalendars = array_merge($oCalendarsOwn, $oCalendarsShared);		

		foreach ($oCalendars as $oCalendar)
		{
			$this->InitCalendar($oCalendar);

			$calendarId = $oCalendar->Url;

			$sCalendarActive = '1';
			$sCalendarIdForCookie = str_replace('.', '_', $oCalendar->Url);
			if (isset($_COOKIE[$sCalendarIdForCookie])) 
			{
				$sCalendarActive = $_COOKIE[$sCalendarIdForCookie];
			}
			
			$calendar = array(
				'calendar_active' => $sCalendarActive,
				'calendar_color' => CalendarColors::GetColorNumber($oCalendar->Color),
				'calendar_description' => $oCalendar->Description,
				'calendar_id' => $calendarId,
				'principal_id' => $this->Dav->GetMainPrincipalUrl($oCalendar->Principals[0]),
				'calendar_name' => $oCalendar->DisplayName,
				'user_id' => $oAccount->IdUser,
				'ical_hash' => null
			);
			
			if ($oCalendar->Shared)
			{
				$calendar['publication_hash'] = null;
				$calendar['publication_level'] = '0';
				$calendar['shares'] = array();
				$calendar['sharing_active'] = '1';
				$calendar['sharing_id'] = $calendarId;
				$calendar['sharing_level'] = $oCalendar->SharingLevel;
				
				$calendars['shared'][$calendarId] = $calendar;
			}
			else
			{
				$aCalendarUsers = $this->GetCalendarUsers($oAccount, $oCalendar);

				$aShares = array();
				$sPubHash = null;
				$sPubLevel = null;
				
				foreach ($aCalendarUsers as $aCalendarUser)
				{
					if ($aCalendarUser['email'] == $this->GetPublicUser())
					{
						$sPubLevel = '1';
						$sPubHash = $this->GetPublicCalendarHash($oAccount, $calendarId);
					}
					else
					{
						$aShares[] = array(
							'id_share' => $aCalendarUser['email'], 
							'email_to_user' => $aCalendarUser['email'], 
							'int_access_level' => (int)$aCalendarUser['access_level']
						);
					}
				}

				$calendar['publication_hash'] = $sPubHash;
				$calendar['publication_level'] = $sPubLevel;
				$calendar['shares'] = $aShares;
				$calendar['sharing_active'] = null;
				$calendar['sharing_id'] = null;
				$calendar['sharing_level'] = null;
				
				$calendars['user'][$calendarId] = $calendar;
			}
		}
		
		return $calendars;		
	}


	/**
	 * @param CAccount $oAccount
	 * @param string $sName
	 * @param string $sDescription
	 * @param int $iOrder
	 * @param string $sColor
	 */
	public function CreateCalendar($oAccount, $sName, $sDescription, $iOrder, $sColor)
	{
		$this->Init($oAccount);
		
		$sSystemName = afterlogic_DAV_Client::getUUID();
		$sCalendarHomeSet = $this->CalendarHomeSet;
		
		$res = $this->Dav->CreateCalendar($sSystemName, $sName, $sDescription, $iOrder, $sColor, 
				$sCalendarHomeSet);
		if ($res['statusCode'] > 400)
		{
			CApi::LogObject($res);
			return false;
		}
		return $sCalendarHomeSet.$sSystemName;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sName
	 * @param string $sDescription
	 * @param int $iOrder
	 * @param string $sColor
	 */
	public function UpdateCalendar($oAccount, $sCalendarId, $sName, $sDescription, $iOrder, 
			$sColor)
	{
		$this->Init($oAccount);
		
		$res = $this->Dav->UpdateCalendar($sCalendarId, $sName, $sDescription, $iOrder, $sColor);
		if ($res['statusCode'] > 400)
		{
			CApi::LogObject($res);
			return false;
		}
		return true;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sColor
	 */
	public function UpdateCalendarColor($oAccount, $sCalendarId, $sColor)
	{
		$this->Init($oAccount);
		
		$res = $this->Dav->UpdateCalendarColor($sCalendarId, $sColor);
		if ($res['statusCode'] > 400)
		{
			CApi::LogObject($res);
			return false;
		}
		return true;
	}

	/**
	 * @param string $sCalendarId
	 * @param int $iVisible
	 */
	public function UpdateCalendarVisible($sCalendarId, $iVisible)
	{
		setcookie($sCalendarId, $iVisible, time() + 86400);
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function DeleteCalendar($oAccount, $sCalendarId)
	{
		$this->Init($oAccount);
		
		$res = $this->Dav->DeleteEntry($sCalendarId);
		if ($res['statusCode'] > 400)
		{
			CApi::LogObject($res);
			return false;
		}
		
		return true;
	}	

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sUserId
	 * @param string $sPerm
	 */
	public function UpdateCalendarShare($oAccount, $sCalendarId, $sUserId, $sPerms = '')
	{
		if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarSharingSupported())
		{
			$this->Init($oAccount);

			if ($this->Dav->isCustomServer)
			{
				$iMode = 0;
				switch ($sPerms)
				{
					case 'W':
						$iMode = 1;
						break;
					case 'R':
						$iMode = 2;
						break;
					default:
						$iMode = 0;
						break;
				}

				$oCalendar = $this->GetCalendar($oAccount, $sCalendarId);

				if ($oCalendar)
				{
					if (count($oCalendar->Principals) > 0)
					{
						if (!$this->Pdo)
						{
							throw new CApiBaseException(Errs::Db_PdoExceptionError);
						}
						$cacheBackend = new afterlogic_DAV_Share_Backend_PDO($this->Pdo, $this->DbPrefix);
						$calendarUri = $cacheBackend->UpdateShare($sCalendarId, $oAccount->Email, $sUserId, $iMode);
						if ($calendarUri)
						{
							$this->DeleteRemindersCache($calendarUri);
							$this->CreateRemindersCache($sUserId, $calendarUri);
						}				
					}
				}
				return true;
			}
		}
		else
		{
			return false;
		}
	}		
	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function PublicCalendar($oAccount, $sCalendarId)
	{
		return $this->UpdateCalendarShare($oAccount, $sCalendarId, $this->GetPublicUser(), 'R');
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnPublicCalendar($oAccount, $sCalendarId)
	{
		return $this->UpdateCalendarShare($oAccount, $sCalendarId, $this->GetPublicUser());
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnSubscribeCalendar($oAccount, $sCalendarId)
	{
		if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarSharingSupported())
		{
			$this->Init($oAccount);

			$permsToDelete = array();

			$oCalendar = $this->GetCalendar($oAccount, $sCalendarId);

			if ($oCalendar && $oCalendar->Shared)
			{
				if (count($oCalendar->Principals) > 0)
				{
					$proxy = $oCalendar->Principals[0];
					$proxy = str_replace('/calendar-proxy-write', '', $proxy);
					$proxy = str_replace('/calendar-proxy-read', '', $proxy);		

					$permsToDelete[] = $proxy . '/calendar-proxy-write';
					$permsToDelete[] = $proxy . '/calendar-proxy-read';

					foreach ($permsToDelete as $permToDelete)
					{
						$this->Dav->DeleteProxy($permToDelete, $oAccount->Email);
					}
				}
			}
		}
		else
		{
			return false;
		}
	}		
	
	/**
	 * @param CAccount $oAccount
	 * @param string $oCalendar
	 */
	public function GetCalendarUsers($oAccount, $oCalendar)	
	{
		if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarSharingSupported())
		{
			$this->Init($oAccount);

			if ($oCalendar != null)
			{
				if (count($oCalendar->Principals) > 0)
				{
					$principal = str_replace('/calendar-proxy-write', '', $oCalendar->Principals[0]);
					$principal = str_replace('/calendar-proxy-read', '', $principal);
					$principalUri = 'principals/' . basename($principal);
					$calendarUri = basename($oCalendar->Url);

					if (!$this->Pdo)
					{
						throw new CApiBaseException(Errs::Db_PdoExceptionError);
					}
					$calendarPDO = new afterlogic_DAV_CalDAV_Backend_PDO($this->Pdo, $this->DbPrefix);
					$res = $calendarPDO->getCalendarUsers($principalUri, $calendarUri) ;

					$result = array();
					foreach($res as $row) 
					{
						$result[] = array(
							'id_share' => basename($row['uri']), 
							'email' => basename($row['uri']), 
							'access_level' => $row['mode']
						);
					}				

					return $result;
				}
			}
		}
		return array();
	}
	
	/**
	 * @param string $sUser
	 * @return string
	 */	
	protected static function generatePrincipalName($sUser)
	{
		list($sUserName, $sDomain) = explode('@', $sUser);
		$sNewUser = $sUserName.'-'.str_replace("-", "", fterlogic_DAV_Client::getUUID()).'@'.$sDomain;

		if($sDomain == '') $sNewUser = rtrim($sNewUser, "@");

		return $sNewUser;
	}	
	
	/**
	 * @param CalendarInfo $oCalendar
	 * @param string $sData
	 * @param bool $onlyAlarms
	 */
	public function ParseIcal($oCalendar, $vCal, $onlyAlarms = false)
	{
		$result = array();
		$result['data'] = array();
		$result['events'] = array();
		$result['exclusions'] = array();
		$result['reminders'] = array();
		$result['appointments'] = array();
		
		if ($vCal)
		{
			$baseEvents = $vCal->getBaseComponents('VEVENT');
			if (isset($baseEvents))
			{
				foreach ($baseEvents as $baseEvent)
				{
					$eventId = $baseEvent->UID->value;
					$result['data'][$eventId] = $vCal;
					
					$isAppointment = false;
					// Appointments
					if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarAppointmentsSupported())
					{
						if (isset($baseEvent->ATTENDEE))
						{
							$isAppointment = true;
							if (isset($baseEvent->ORGANIZER))
							{
								$oCalendar->Owner = str_replace('mailto:', '', 
										strtolower($baseEvent->ORGANIZER->value));
							}
							if ($oCalendar->Owner == $this->Account->Email)
							{
								$isAppointment = false;
							}
							$attendees = $baseEvent->ATTENDEE;

							$appointmentId = 1;
							foreach($attendees as $attendee)
							{
								$status = 0;
								$PARTSTAT = '';
								if ($attendee->offsetExists('PARTSTAT'))
								{
									$PARTSTAT = $attendee->offsetGet('PARTSTAT');
									switch (strtoupper($PARTSTAT->value))
									{
										case 'ACCEPTED':
											$status = 1;
											break;
										case 'DECLINE':
											$status = 2;
											break;
										case 'TENTATIVE':
											$status = 3;
											break;
									}
								}
								$email = '';
								if ($attendee->offsetExists('EMAIL'))
								{
									$email = $attendee->offsetGet('EMAIL')->value;
								}
								else
								{
									$email = str_replace('mailto:', '', strtolower($attendee->value));
								}

								$oAcct = $this->ApiUsersManager->GetAccountOnLogin($email);
								$userId = 0;
								if (isset($oAcct))
								{
									$userId = $oAcct->IdUser;
								}
								$accessType = 0;
								$result['appointments'][$eventId][$email] = array(
										'accessType' => $accessType,
										'appointmentId' => $email,
										'email' => $email,
										'eventId' => $eventId,
										'status' => $status,
										'userId' => $userId
								);
								$appointmentId++;
							}
						}
					}
					
					// Reminders
					if ($baseEvent->VALARM)
					{
						$reminderId = 1;
						foreach($baseEvent->VALARM as $alarm)
						{
							if (isset($alarm->TRIGGER))
							{
								$result['reminders'][$eventId][$reminderId] = array(
									'id_event' => $eventId,
									'id_reminder' => $reminderId,
									'remind_offset' => $alarm->TRIGGER->value
								);
								$reminderId++;
							}
						}
					}
					else if ($onlyAlarms)
					{
						continue;
					}
					
					$eventAllDay = '0';
					if (isset($baseEvent->DTSTART))
					{
						$dateParam = $baseEvent->DTSTART->offsetGet('value');
						if ($dateParam && strtoupper($dateParam->value) == 'DATE')
						{
							$eventAllDay = '1';

							$baseEvent->DTSTART->value = $baseEvent->DTSTART->value . 'T000000Z';
							$baseEvent->DTEND->value = $baseEvent->DTEND->value . 'T000000Z';
						}
					}
					
					$sEventDTStart = $this->GetStrDate($baseEvent->DTSTART);
					$sEventDTEnd = $this->GetStrDate($baseEvent->DTEND);

					$simpleEvent = array(
						'calendar_id' => $oCalendar->Url,
						'allday_flag' => (int) $eventAllDay,
						'event_allday' => $eventAllDay,
						'event_id' => $eventId,
						'event_name' => $baseEvent->SUMMARY ? $baseEvent->SUMMARY->value : '',
						'event_text' => $baseEvent->DESCRIPTION ? $baseEvent->DESCRIPTION->value : '',
						'event_timefrom' => $sEventDTStart,
						'event_timetill' => $sEventDTEnd,
						'event_dtstart' => $baseEvent->DTSTART->value,
						'event_owner_email' => $oCalendar->Owner
					);
					
					$result['events'][$eventId] = $simpleEvent;

					$result['events'][$eventId]['appointment'] = $isAppointment;
					$result['events'][$eventId]['event_appointment_access'] = '0';
					$result['events'][$eventId]['event_repeats'] = '0';

					if (isset($baseEvent->RRULE))
					{
						$aRRULE = array();
						$aRRULE = $this->ParseRRULE($vCal, $eventId);
						$result['events'][$eventId] = array_merge($result['events'][$eventId], $aRRULE);
						
						$sWeekDays = array(
							0 => $aRRULE['sun'],
							1 => $aRRULE['mon'],
							2 => $aRRULE['tue'],
							3 => $aRRULE['wed'],
							4 => $aRRULE['thu'],
							5 => $aRRULE['fri'],
							6 => $aRRULE['sat'] 
						);
					}

					if (isset($baseEvent->EXDATE))
					{
						$result['events'][$eventId]['excluded'] = '1';
						foreach ($baseEvent->EXDATE as $exdate)
						{
							$recurrenceId = $this->GetStrDate($exdate, 'Ymd');

//							$repeatId = DAV_Convert_Utils::_getRepeatIdExclution($exdate, $vCal, $eventId);
							$repeatId = DAV_Convert_Utils::getRepeatIdExclution(
									new DateTime($result['events'][$eventId]['event_dtstart']), 
									$exdate->value, 
									$result['events'][$eventId]['repeat_order'], 
									$result['events'][$eventId]['repeat_period'], 
									$sWeekDays, 
									isset($result['events'][$eventId]['week_number'])?
										$result['events'][$eventId]['week_number']:'0'
							);

							$exclusionId = $eventId.'_'.$repeatId.'_'.$recurrenceId;

							$result['exclusions'][$exclusionId] = $simpleEvent;
							$result['exclusions'][$exclusionId]['id_recurrence_date'] = $recurrenceId;
							$result['exclusions'][$exclusionId]['id_repeat'] = $repeatId;
							$result['exclusions'][$exclusionId]['is_deleted'] = '1';
						}
					} 					
				}
			}
			
			if (isset($vCal->VEVENT))
			{
				foreach ($vCal->VEVENT as $event)
				{
					if (isset($event->{'RECURRENCE-ID'}))
					{
						$eventId = $event->UID->value;

						$eventAllDay = '0';
						$dateParam = $event->DTSTART->offsetGet('value');
						if ($dateParam && strtoupper($dateParam->value) == 'DATE')
						{
							$eventAllDay = '1';

							$event->DTSTART->value = $event->DTSTART->value . 'T000000Z';
							$event->DTEND->value = $event->DTEND->value . 'T000000Z';
						}

						$sEventDTStart = $this->GetStrDate($event->DTSTART);
						$sEventDTEnd = $this->GetStrDate($event->DTEND);

						$simpleEvent = array(
							'calendar_id' => $oCalendar->Url,
							'event_allday' => $eventAllDay,
							'event_id' => $eventId,
							'event_name' => $event->SUMMARY ? $event->SUMMARY->value : '',
							'event_text' => $event->DESCRIPTION ? $event->DESCRIPTION->value : '',
							'event_timefrom' => $sEventDTStart,
							'event_timetill' => $sEventDTEnd,
							'event_dtstart' => $event->DTSTART->value,
							'event_owner_email' => $oCalendar->Owner
						);

						$sWeekDays = array();
						$sWeekDays[0] = $result['events'][$eventId]['sun'];
						$sWeekDays[1] = $result['events'][$eventId]['mon'];
						$sWeekDays[2] = $result['events'][$eventId]['tue'];
						$sWeekDays[3] = $result['events'][$eventId]['wed'];
						$sWeekDays[4] = $result['events'][$eventId]['thu'];
						$sWeekDays[5] = $result['events'][$eventId]['fri'];
						$sWeekDays[6] = $result['events'][$eventId]['sat']; 

						$recurrenceId = $this->GetStrDate($event->{'RECURRENCE-ID'}, 'Ymd');
//						$repeatId = DAV_Convert_Utils::_getRepeatIdExclution($event->{'RECURRENCE-ID'}, $vCal, $eventId);
						
						$repeatId = DAV_Convert_Utils::getRepeatIdExclution(
								new DateTime($result['events'][$eventId]['event_dtstart']), 
								$event->{'RECURRENCE-ID'}->value, 
								$result['events'][$eventId]['repeat_order'], 
								$result['events'][$eventId]['repeat_period'], 
								$sWeekDays, 
								isset($result['events'][$eventId]['week_number'])?
										$result['events'][$eventId]['week_number']:'0');

						$exclusionId = $eventId . '_' . $repeatId . '_' . $recurrenceId;

						$result['exclusions'][$exclusionId] = $simpleEvent;

						$result['exclusions'][$exclusionId]['id_recurrence_date'] = $recurrenceId;
						$result['exclusions'][$exclusionId]['id_repeat'] = $repeatId;
						$result['exclusions'][$exclusionId]['is_deleted'] = '0';

						$result['events'][$eventId]['excluded'] = '1';
					}
				}
			}			
		}
		
		return $result;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetEvents($oAccount, $sCalendarId, $dStart, $dFinish)
	{
		$this->Init($oAccount);

		$result = array();
		$result['events'] = array();
		$result['exclusions'] = array();
		$result['reminders'] = array();
		$result['appointments'] = array();
		
		if ($dStart != null) $dStart = $dStart . 'T000000Z';
		if ($dFinish != null) $dFinish = $dFinish . 'T235959Z';
		
		$events = $this->Dav->GetEvents($sCalendarId, $dStart, $dFinish);
		
		if ($events !== false && is_array($events))
		{
			foreach($events as $event)
			{
				if (isset($event['data']))
				{
					$oCalendar = $this->GetCalendar($oAccount, $sCalendarId);
					$vCal = Sabre_VObject_Reader::read($event['data']);
					$parsedData = $this->ParseIcal($oCalendar, $vCal);
					
					$result['events'] = array_merge($result['events'], $parsedData['events']);
					$result['exclusions'] = array_merge($result['exclusions'], $parsedData['exclusions']);
					$result['reminders'] = array_merge($result['reminders'], $parsedData['reminders']);
					$result['appointments'] = array_merge($result['appointments'], $parsedData['appointments']);
				}
			}
		}
		return $result;
	}
	

	/**
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetPublicEvents($sCalendarId, $dStart, $dFinish)
	{
		$this->InitByEmail($this->GetPublicUser());
		
		return $this->GetEvents($this->Account, $sCalendarId, $dStart, $dFinish);
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function GetEvent($oAccount, $sCalendarId, $sEventId)
	{
		$this->Init($oAccount);
		
		$result = array();
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$oCalendar = $this->GetCalendar($oAccount, $sCalendarId);
			$vCal = Sabre_VObject_Reader::read($aData['data']);
			$result = $this->ParseIcal($oCalendar, $vCal);
		}
		return $result;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param string $recurrenceId
	 */
	public function GetExclusion($oAccount, $sCalendarID, $sEventId, $recurrenceId)
	{
		$event = $this->GetEvent($oAccount, $sCalendarID, $sEventId);
		if (is_array($event) && isset($event['exclusions']))
		{
			$exclusions = $event['exclusions'];
			foreach ($exclusions as $exclusion)
			{
				if ($recurrenceId == $exclusion['id_recurrence_date'])
				{
					return	$exclusion;
				}
			}
		}
		return array();
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function GetEventData($oAccount, $sCalendarId, $sEventId)
	{
		$this->Init($oAccount);
		$event = $this->Dav->GetEventByUid($sCalendarId, $sEventId);
		if ($event !== false && is_array($event))
		{
			return $event;
		}
		return false;
	}

	protected function PrepareDateTime($sDate, $sTime, $sAllday = false)
	{
		if (!empty($sDate) && !empty($sTime))
		{
			$sDate = urldecode(trim($sDate));
			$sTime = trim(urldecode($sTime));
			
			$hour = $min = '00';
			if (!$sAllday)
			{
				list($hour, $min) = explode(':', $sTime);
			}
			
			$year = substr($sDate, 0, 4);
			$month = substr($sDate, 4, 2);
			$day = substr($sDate, 6, 2);
			
			$sDateTime = $year.'-'.$month.'-'.$day.' '.$hour.':'.$min.':00';
			return (new DateTime($sDateTime, new DateTimeZone($this->TimeZone))); 
		}
		return null;
	}
	
	protected function PrepareEvent($aArgs, &$vCal, &$vEvent, $sEventUID = null)
	{
		unset($vEvent->{'LAST-MODIFIED'});
		$oLastModified = new Sabre_VObject_Property_DateTime('LAST-MODIFIED');
		$oLastModified->setDateTime(new DateTime('now'), Sabre_VObject_Property_DateTime::UTC);
		$vEvent->add($oLastModified);
		
		if (empty($sEventUID))
		{
			if (!empty($aArgs['event_id']))
			{
				$vEvent->UID = $aArgs['event_id'];
			}
		}
		else
		{ 
			$vEvent->UID = $sEventUID;
		}

		if (!empty($aArgs['from']) && !empty($aArgs['time_from']) && 
				!empty($aArgs['till']) && !empty($aArgs['time_till']))
		{
			$bAllday = (!empty($aArgs['allday'])) ? true : false;
			
			$oDTStart = $this->PrepareDateTime($aArgs['from'], $aArgs['time_from'], $bAllday);
			$oDTEnd = $this->PrepareDateTime($aArgs['till'], $aArgs['time_till'], $bAllday);
			
			if (isset($oDTStart))
			{
				unset($vEvent->DTSTART);
				$dtstart = new Sabre_VObject_Property_DateTime('DTSTART');
				if ($bAllday)
				{
					$dtstart->setDateTime($oDTStart, Sabre_VObject_Property_DateTime::DATE);
				}
				else
				{
					$dtstart->setDateTime($oDTStart, Sabre_VObject_Property_DateTime::UTC);
				}
				$vEvent->add($dtstart);
			}
			if (isset($oDTEnd))
			{
				unset($vEvent->DTEND);
				$dtend = new Sabre_VObject_Property_DateTime('DTEND');
				if ($bAllday)
				{
					$dtend->setDateTime($oDTEnd, Sabre_VObject_Property_DateTime::DATE);
				}
				else
				{
					$dtend->setDateTime($oDTEnd, Sabre_VObject_Property_DateTime::UTC);
				}
				$vEvent->add($dtend);
			}
		}
		
		if (!empty($aArgs['name']))
		{
			$vEvent->SUMMARY = $aArgs['name'];
		}
		if (!empty($aArgs['text']))
		{
			$vEvent->DESCRIPTION = $aArgs['text'];
		}
		
		if (!empty($aArgs['allow_repeat']))
		{
			$sRRULE = $this->GetRRULE($aArgs);
			if (trim($sRRULE) != '')
			{
				$rRule = new Sabre_VObject_Property('RRULE');
				$rRule->value = $sRRULE;
				$vEvent->RRULE = $rRule;
			}
		}		
		else
		{
			unset($vEvent->RRULE);
		}

		unset($vEvent->VALARM);
		if (!empty($aArgs['reminder_offset']))
		{
			foreach ($aArgs['reminder_offset'] as $offset)
			{
				$vAlarm = new Sabre_VObject_Component('VALARM');
				$vAlarm->TRIGGER = $offset;
				$vAlarm->DESCRIPTION = 'Alarm';
				$vAlarm->ACTION = 'DISPLAY'; 			
				
				$vEvent->add($vAlarm);
			}
		}
		
		// Appointments
		if ($this->ApiCollaborationManager && $this->ApiCollaborationManager->IsCalendarAppointmentsSupported())
		{
			$appointmentsDelete = array();
			if (isset($aArgs['appointments_delete']) && $aArgs['appointments_delete'])
			{
				$appointmentsDelete = $aArgs['appointments_delete'];
			}
			$appointmentsSave = array();
			if (isset($aArgs['appointments_save']) && $aArgs['appointments_save'])
			{
				$appointmentsSave = $aArgs['appointments_save'];
			}
			$emails = array();
			if ($vEvent->ATTENDEE)
			{
				$attendees = $vEvent->ATTENDEE;

				if (count($attendees) <= count($appointmentsDelete))
				{
					unset($vEvent->ORGANIZER);
				}

				unset($vEvent->ATTENDEE);
				foreach($attendees as $attendee)
				{
					$email = str_replace('mailto:', '', $attendee->value);
					if (!in_array($email, $appointmentsDelete))
					{
						$vEvent->add($attendee);
						$emails[] = $email;
					}
				}
			}
			if (count($appointmentsSave)>0)
			{
				$vEvent->ORGANIZER = 'mailto:'.$this->Account->Email;
				foreach($appointmentsSave as $appointmentSave)
				{
					if (!in_array($appointmentSave, $emails))
					{
						$attendee = new Sabre_VObject_Property('ATTENDEE');
						$attendee->value = 'mailto:'.$appointmentSave;
						$attendee->add(new Sabre_VObject_Parameter('RSVP', 'TRUE'));
						$vEvent->add($attendee);
					}
				}
			}
			$attendees = $vEvent->ATTENDEE;
			if (isset($attendees))
			{
				foreach($attendees as $attendee)
				{
					$email = str_replace('mailto:', '', $attendee->value);
					$PARTSTAT = $attendee->offsetGet('PARTSTAT');
					if (!isset($PARTSTAT) || (isset($PARTSTAT) && $PARTSTAT->value != 'DECLINED'))
					{
						$sMethod = 'REQUEST';
						$vCal->METHOD = $sMethod;
						$sBody = $vCal->serialize();
						unset($vCal->METHOD);
						$this->sendAppointmentMessage($this->Account, $email, $vEvent->SUMMARY->value, 
								$sBody, $sMethod);
					}
				}
			}		
		}
	}

	/**
	}
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param array $aArgs
	 */
	public function CreateEvent($oAccount, $sCalendarId, $aArgs)
	{
		$this->Init($oAccount);
		
        $vCal = new Sabre_VObject_Component('VCALENDAR');
        $vCal->VERSION = "2.0";
        $vCal->CALSCALE = 'GREGORIAN';

		$sEventUID = $this->Dav->GetUUID();

		$vCal->VEVENT = new Sabre_VObject_Component('VEVENT');
        $vCal->VEVENT->SEQUENCE = 1;
        $vCal->VEVENT->TRANSP = 'OPAQUE';
		

		$dtstamp = new Sabre_VObject_Property_DateTime('DTSTAMP');
        $dtstamp->setDateTime(new DateTime('now'), Sabre_VObject_Property_DateTime::UTC);
        $vCal->VEVENT->add($dtstamp);		
		
		$this->PrepareEvent($aArgs, $vCal, $vCal->VEVENT, $sEventUID);
		
		$res = $this->Dav->CreateEvent($sCalendarId.'/'.$sEventUID.'.ics', $vCal->serialize());
		
		if (is_array($res))
		{
			if ($res['statusCode'] > 400)
			{
				CApi::Log('DAV: CreateEvent error result:');
				CApi::LogObject($res);
			}
			else
			{
				return $sEventUID;
			}
		}
		else
		{
			CApi::Log('DAV: CreateEvent error false result');
		}
		
		return null;
	}
	
	public function GetBaseVEventIndex($vEvent)
	{
		$mResult = false;
		$index = -1;
		foreach($vEvent as $component) 
		{
			$index++;
			if (empty($component->{'RECURRENCE-ID'})) break;
		}
		if ($index >= 0)
		{
			$mResult = $index;
		}
		else
		{
			$mResult = false;
		}
		return $mResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param string $sData
	 */
	public function UpdateEventData($oAccount, $sCalendarId, $sEventId, $sData)
	{
		$this->Init($oAccount);
		$statusCode = 401;
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$res = $this->Dav->UpdateEvent($sCalendarId.'/'.$aData['href'], $sData);
			$statusCode = $res['statusCode'];
		}
		else
		{
			$res = $this->Dav->CreateEvent($sCalendarId.'/'.$sEventId.'.ics', $sData);
			$statusCode = $res['statusCode'];
		}
		
		if ($statusCode > 400)
		{
			CApi::LogObject($res);
			return false;
		}
		return true;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param array $aArgs
	 */
	public function UpdateEvent($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$this->Init($oAccount);
		
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$vCal = Sabre_VObject_Reader::read($aData['data']);
			
			if ($vCal)
			{
				$index = $this->GetBaseVEventIndex($vCal->VEVENT);
				if ($index !== false)
				{
					$this->PrepareEvent($aArgs, $vCal, $vCal->VEVENT[$index]);
				}
			}
			
			$res = $this->Dav->UpdateEvent($sCalendarId.'/'.$aData['href'], $vCal->serialize());
			if ($res['statusCode'] > 400)
			{
				CApi::LogObject($res);
				return false;
			}
			return true;
		}
		return false;
	}
	
	public function MoveEvent($oAccount, $sCalendarId, $sNewCalendarId, $sEventId)
	{
		$this->Init($oAccount);
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$res = $this->Dav->MoveEvent($sCalendarId.'/'.$aData['href'], $sNewCalendarId.'/'.$aData['href']);
			if ($res['statusCode'] > 400)
			{
				CApi::LogObject($res);
				return false;
			}
			return true;
		}
		return false;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function DeleteEvent($oAccount, $sCalendarId, $sEventId)
	{
		$this->Init($oAccount);
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$res = $this->Dav->DeleteEntry($sCalendarId.'/'.$aData['href']);
			if ($res['statusCode'] > 400)
			{
				CApi::LogObject($res);
				return false;
			}
			return true;
		}
		return false;
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param array $aArgs
	 */
	public function UpdateExclusion($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$this->Init($oAccount);
		
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$vCal = Sabre_VObject_Reader::read($aData['data']);
			$index = $this->GetBaseVEventIndex($vCal->VEVENT);
			if ($index !== false)
			{
				unset($vCal->VEVENT[$index]->{'LAST-MODIFIED'});
				$oLastModified = new Sabre_VObject_Property_DateTime('LAST-MODIFIED');
				$oLastModified->setDateTime(new DateTime('now'), Sabre_VObject_Property_DateTime::UTC);
				$vCal->VEVENT[$index]->add($oLastModified);
			
				$oDTExdate = $this->PrepareDateTime($aArgs['id_recurrence_date'], $aArgs['event_time_from']);
				$oExdate = new Sabre_VObject_Property_DateTime('EXDATE');
				$oExdate->setDateTime($oDTExdate, Sabre_VObject_Property_DateTime::UTC);
				$exdate = $oExdate->value;
				
				$mIndex = $this->isRecurrenceExists($vCal->VEVENT, $aArgs['id_recurrence_date']);
				if (isset($aArgs['is_deleted']) && $aArgs['is_deleted'] == 1)
				{
					$vCal->VEVENT[$index]->add(new Sabre_VObject_Property('EXDATE', $exdate));	
					
					if (false !== $mIndex)
					{
						$events = $vCal->VEVENT;
						unset($vCal->VEVENT);

						foreach($events as $event)
						{
							if ($event->{'RECURRENCE-ID'})
							{
								$recurrenceId = $this->GetStrDate($event->{'RECURRENCE-ID'}, 'Ymd');		
								if ($recurrenceId == $aArgs['id_recurrence_date'])
								{
									continue;
								}
							}
							$vCal->add($event);
						}					
					}
				}
				else
				{
					$recurEvent = null;
					if ($mIndex === false)
					{
						$recurEvent = new Sabre_VObject_Component('VEVENT');
						$recurEvent->SEQUENCE = 1;
						$recurEvent->TRANSP = 'OPAQUE';
						$recurEvent->{'RECURRENCE-ID'} = $exdate;
						$vCal->add($recurEvent);
					}
					else if (isset($vCal->VEVENT[$mIndex]))
					{
						$recurEvent = $vCal->VEVENT[$mIndex];
					}
					
					if ($recurEvent)
					{
						$this->PrepareEvent($aArgs, $vCal, $recurEvent);
					}
				}

				$res = $this->Dav->UpdateEvent($sCalendarId.'/'.$aData['href'], $vCal->serialize());

				if ($res['statusCode'] > 400)
				{
					CApi::LogObject($res);
					return false;
				}
				return true;
			}
		}
		return false;
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param array $aArgs
	 */
	public function DeleteExclusion($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$this->Init($oAccount);
		
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$elements = Sabre_VObject_Reader::read($aData['data']);
			
			$events = $elements->VEVENT;
			unset($elements->VEVENT);
			
			foreach($events as $event)
			{
				if ($event->{'RECURRENCE-ID'})
				{
					$recurrenceId = $this->GetStrDate($event->{'RECURRENCE-ID'}, 'Ymd');		
					if ($recurrenceId == $aArgs['id_recurrence_date'])
					{
						continue;
					}
				}
				$elements->add($event);
			}
			
			$res = $this->Dav->UpdateEvent($sCalendarId.'/'.$aData['href'], $elements->serialize());
			
			if ($res['statusCode'] > 400)
			{
				CApi::LogObject($res);
				return false;
			}
			return true;
		}
		return false;
	}		
	
	private function isRecurrenceExists($vEvent, $sRecurrenceId)
	{
		$mResult = false;
		foreach($vEvent as $mKey => $event)
		{
			if (isset($event->{'RECURRENCE-ID'}))
			{
				$recurrenceId = $this->GetStrDate($event->{'RECURRENCE-ID'}, 'Ymd');
				
				if ($recurrenceId == $sRecurrenceId)
				{
					$mResult = $mKey;
					break;
				}
			}					
		}
		
		return $mResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetAlarms($oAccount, $sCalendarId, $dStart, $dFinish)
	{
		$this->Init($oAccount);
		
		$result = array();
		$result['data'] = array();
		$result['events'] = array();
		$result['exclusions'] = array();
		$result['reminders'] = array();
		$result['appointments'] = array();
		
		$events = $this->Dav->GetEvents($sCalendarId, $dStart, $dFinish);
		
		if ($events !== false && is_array($events))
		{
			foreach($events as $event)
			{
				if (isset($event['data']))
				{
					$oCalendar = $this->GetCalendar($oAccount, $sCalendarId);
					$vCal = Sabre_VObject_Reader::read($event['data']);
					$Data = $this->ParseIcal($oCalendar, $vCal, true);
					
					$result['data'] = array_merge($result['data'], $Data['data']);
					$result['events'] = array_merge($result['events'], $Data['events']);
					$result['exclusions'] = array_merge($result['exclusions'], $Data['exclusions']);
					$result['reminders'] = array_merge($result['reminders'], $Data['reminders']);
					$result['appointments'] = array_merge($result['appointments'], $Data['appointments']);
				}
			}
		}
		else
		{
			$result = array();
		}
		return $result;
	}
	
	public function GetRemindersCache($type, $start, $end)
	{
		if (!$this->Pdo)
		{
			throw new CApiBaseException(Errs::Db_PdoExceptionError);
		}
		$cacheBackend = new afterlogic_DAV_Cache_Backend_PDO($this->Pdo, $this->DbPrefix);
		return $cacheBackend->getRemindersCache($type, $start, $end);
	}
	
	public function CreateRemindersCache($user, $calendarUri, $type = 0, $time = null, $startTime = null,
			$eventid = null)
	{
		if (!$this->Pdo)
		{
			throw new CApiBaseException(Errs::Db_PdoExceptionError);
		}
		$cacheBackend = new afterlogic_DAV_Cache_Backend_PDO($this->Pdo, $this->DbPrefix);
		return $cacheBackend->createRemindersCache($user, $calendarUri, $type, $time, $startTime, $eventid);
	}

	public function UpdateRemindersCache($id, $user, $calendarUri, $type, $time, $startTime, $eventid)
	{
		if (!$this->Pdo)
		{
			throw new CApiBaseException(Errs::Db_PdoExceptionError);
		}
		$cacheBackend = new afterlogic_DAV_Cache_Backend_PDO($this->Pdo, $this->DbPrefix);
		return $cacheBackend->updateRemindersCache($id, $user, $calendarUri, $type, $time, $startTime, $eventid);
	}
	
	public function DeleteRemindersCache($calendarUri)
	{
		if (!$this->Pdo)
		{
			throw new CApiBaseException(Errs::Db_PdoExceptionError);
		}
		$cacheBackend = new afterlogic_DAV_Cache_Backend_PDO($this->Pdo, $this->DbPrefix);
		return $cacheBackend->deleteRemindersCache($calendarUri);
	}
	
	public function GetFirstCalendarId($oAccount)
	{
		$this->Init($oAccount);
		$calendars = $this->Dav->GetCalendars($this->CalendarHomeSet);
		if (isset($calendars) && count($calendars) > 0)
		{
			$firstCalendar = current($calendars);
			$sCalendarId = $firstCalendar['value']->Url;
			return $sCalendarId;
		}
		return false;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sTo
	 * @param string $sSubject
	 * @param string $sBody
	 * @param string $sMethod
	 * @return WebMailMessage
	 */
	protected function buildAppointmentMessage($oAccount, $sTo, $sSubject, $sBody, $sMethod)
	{
		$oMessage = null;
		if ($oAccount && !empty($sTo) && !empty($sBody) && class_exists('WebMailMessage'))
		{
			$oMessage = new WebMailMessage();
			$GLOBALS[MailDefaultCharset] = CPAGE_UTF8;
			$GLOBALS[MailInputCharset] = CPAGE_UTF8;
			$GLOBALS[MailOutputCharset] = APP_DEFAULT_OUTPUT_CHARSET;

			$oMessage->Headers->SetHeaderByName(MIMEConst_MimeVersion, '1.0');
			$oMessage->Headers->SetHeaderByName(MIMEConst_XMailer, CApi::GetConf('webmail.xmailer-value', 'PHP'));

			$sIp = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
			if (null !== $sIp)
			{
				$oMessage->Headers->SetHeaderByName(MIMEConst_XOriginatingIp, $sIp);
			}

			$sServerAddr = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['SERVER_NAME'] : 'cantgetservername';
			$oMessage->Headers->SetHeaderByName(MIMEConst_MessageID,
				'<'.substr(session_id(), 0, 7).'.'.md5(time()).'@'. $sServerAddr .'>');

			$emailAccount = $oAccount->Email;
			
			$oMessage->SetFromAsString($emailAccount);
			$oMessage->SetToAsString($sTo);
			$oMessage->SetSubject($sSubject);
			$oMessage->SetDate(new CDateTime(time()));
			
			if (!empty($sMethod))
			{
				$oMessage->TextBodies->CustomContentType = 'text/calendar; method='.$sMethod.'; charset="utf-8"';
			}
			else
			{
				$oMessage->TextBodies->CustomContentType = 'text/calendar; charset="utf-8"';
			}
			$oMessage->TextBodies->CustomContentTransferEncoding = MIMEConst_8bit;
			$oMessage->TextBodies->PlainTextBodyPart = $sBody;
		}
		
		return $oMessage;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sTo
	 * @param string $sSubject
	 * @param string $sBody
	 * @param string $sMethod
	 * @return WebMailMessage
	 */
	protected function sendAppointmentMessage($oAccount, $sTo, $sSubject, $sBody, $sMethod)
	{
		$oMessage = $this->buildAppointmentMessage($oAccount, $sTo, $sSubject, $sBody, $sMethod);

		CApi::Plugin()->RunHook('webmail-change-appointment-message-before-send',
			array(&$oMessage, &$oAccount));

		if ($oMessage)
		{
			$oMessage->Flags |= MESSAGEFLAGS_Seen;
			$oMessage->OriginalMailMessage = $oMessage->ToMailString(true);
			CApi::Log('IcsProcessAppointmentSendOriginalMailMessage');
			CApi::Log($oMessage->OriginalMailMessage);

			if (!class_exists('CSmtp'))
			{
				require_once CApi::WebMailPath().'common/class_smtp.php';
			}

			return CSmtp::SendMail($oAccount, $oMessage, null, null);
		}
		return false;
	}	
	
	public function IcsPreprocessAppointment($oAccount, $sData)
	{
		$vCal = Sabre_VObject_Reader::read($sData);
		if ($vCal)
		{
			$events = $vCal->getBaseComponents('VEVENT');
			if (isset($events))
			{
				$event = $events[0];
				$sEventId = $event->UID->value;
				$sCalendarId = '';
				
				$oCalendars = $this->GetCalendarObjects($oAccount);
				$aServerData = false;
				$result = array();

				$result['Calendars'] = array();
				if (is_array($oCalendars))
				{
					foreach ($oCalendars as $key => $oCalendar)
					{
						$result['Calendars'][$key] = $oCalendar->DisplayName;
						if ($aServerData === false)
						{
							$aServerData = $this->GetEventData($oAccount, $oCalendar->Url, $sEventId);
						}
					}
				}
				
				$sBody = '';
				$oResultCalendar = $vCal;
				$oResultEvent = $event;
				if ($aServerData !== false)
				{
					$sCalendarId = $aServerData['url'];
					$serverVCalendar = Sabre_VObject_Reader::read($aServerData['data']);
					$serverVCalendar->METHOD = $vCal->METHOD;
					$serverEvents = $serverVCalendar->getBaseComponents('VEVENT');
					$serverEvent = $serverEvents[0];
					
					if (isset($event->{'LAST-MODIFIED'}) && isset($serverEvent->{'LAST-MODIFIED'}))
					{
						$eventLastModified = $event->{'LAST-MODIFIED'}->getDateTime();
						$serverEventLastModified = $serverEvent->{'LAST-MODIFIED'}->getDateTime();
						if ($serverEventLastModified > $eventLastModified)
						{
							$oResultCalendar = $serverVCalendar;
							$oResultEvent = $serverEvent;
						}
					}
				}
				$sMethod = $oResultCalendar->METHOD->value;
				
				$result['Body'] = $oResultCalendar->serialize();
				$result['Action'] = $sMethod;
				
				$result['Location'] = isset($oResultEvent->LOCATION) ? 
						$oResultEvent->LOCATION->value : '';
				$result['Description'] = isset($oResultEvent->DESCRIPTION) ? 
						$oResultEvent->DESCRIPTION->value : '';
				$result['When'] = $this->GetStrDate($oResultEvent->DTSTART, 'D, M d, Y, H:i');
				$result['CalendarId'] = $sCalendarId;
				
				if (isset($oResultEvent->ATTENDEE))
				{
					foreach($oResultEvent->ATTENDEE as $attendee)
					{
						$email = str_replace('mailto:', '', strtolower($attendee->value));
						if ($oAccount->Email == $email)
						{
							$PARTSTAT = $attendee->offsetGet('PARTSTAT');
							if (isset($PARTSTAT))
							{
								$result['Action'] = $sMethod.'-'.$PARTSTAT->value;
							}
						}
					}
				}
				
				return $result;
			}
		}
		return false;
	}
	
	public function IcsProcessAppointment($oAccount, $sAction, $sCalendarId, $sData)
	{
		$bResult = false;
		$sTo = $sSubject = $sBody = $sSummary = '';
		
		$vCal = Sabre_VObject_Reader::read($sData);
		if ($vCal)
		{
			$sMethod = $sMethodOriginal = $vCal->METHOD->value;
			$events = $vCal->getBaseComponents('VEVENT');
			
			if (isset($events))
			{
				$event = $events[0];
				$eventId = $event->UID->value;
				if (isset($event->SUMMARY))
				{
					$sSummary = $event->SUMMARY->value;
				}
				if (isset($event->ORGANIZER))
				{
					$sTo = str_replace('mailto:', '', strtolower($event->ORGANIZER->value));
				}
				if (strtoupper($sMethod) === 'REQUEST')
				{
					$sMethod = 'REPLY';

					if (isset($event->ATTENDEE))
					{
						foreach($event->ATTENDEE as $attendee)
						{
							$email = str_replace('mailto:', '', strtolower($attendee->value));

							if ($oAccount->Email == $email)
							{
								switch (strtoupper($sAction))
								{
									case 'ACCEPTED':
										$attendee->offsetSet('PARTSTAT', 'ACCEPTED');
										$sSubject = 'Accepted: ' . $sSummary;
										break;
									case 'DECLINED':
										$attendee->offsetSet('PARTSTAT', 'DECLINED');
										$sSubject = 'Declined: ' . $sSummary;
										break;
									case 'TENTATIVE':
										$attendee->offsetSet('PARTSTAT', 'TENTATIVE');
										$sSubject = 'Tentative: ' . $sSummary;
										break;
								}
							}
						}
					}
				}
				
				$vCal->METHOD = $sMethod;
				$event->{'LAST-MODIFIED'} = gmdate("Ymd\THis\Z");

				$sBody = $vCal->serialize();

				if ($sCalendarId !== false)
				{
					unset($vCal->METHOD);

					if (strtoupper($sAction) == 'DECLINED' || strtoupper($sMethod) == 'CANCEL')
					{
						$this->DeleteEvent($oAccount, $sCalendarId, $sEventId);
					}
					else
					{
						$this->UpdateEventData($oAccount, $sCalendarId, $eventId, $vCal->serialize());
					}
				}							

				if (strtoupper($sMethodOriginal) == 'REQUEST')
				{
					if (!empty($sTo) && !empty($sBody))
					{
						$bResult = $this->sendAppointmentMessage($oAccount, $sTo, $sSubject, $sBody, 
								$sMethod);
					}
				}
				else
				{
					$bResult = true;
				}
			}
		}
		
		if (!$bResult)
		{
			CApi::Log('IcsProcessAppointment FALSE result!', ELogLevel::Error);
			CApi::Log('Email: '.$oAccount->Email.', Action: '. $sAction.', Data:', ELogLevel::Error);
			CApi::Log($sData, ELogLevel::Error);
		}
		
		return $bResult;
	}
	
	public function UpdateAppointmentRespond($oAccount, $sCalendarId, $sEventId, $sAction)
	{
		$aData = $this->GetEventData($oAccount, $sCalendarId, $sEventId);
		if ($aData !== false)
		{
			$vCal = Sabre_VObject_Reader::read($aData['data']);
			$vCal->METHOD = 'REQUEST';
			return $this->IcsProcessAppointment($oAccount, $sAction, $sCalendarId, $vCal->serialize());
		}
		return false;
	}
	
    public function GetRRULE($aArgs)
    {
		$aPeriods = array(
			'SECONDLY', 
			'MINUTELY', 
			'HOURLY', 
			'DAILY', 
			'WEEKLY', 
			'MONTHLY', 
			'YEARLY'
		);

		$rRule = '';
		$sFreq = '';
		$iInterval = 0;
		$iCount = 0;
		$iEnd = 0;
		$sUntil = '';
		
		if (isset($aArgs['repeat_period']))
		{
			$period = (int) $aArgs['repeat_period'];
			$sFreq = $aPeriods[$period + 3];
			
			$weekNumber = null;
			if (($period == 2 || $period == 3))
			{
				if (isset($aArgs['week_number']))
				{
					$weekNumber = (int) $aArgs['week_number'];
					$weekNumber = ($weekNumber < 0 || $weekNumber > 4) ? 0 : $weekNumber;
				}
				else 
				{
					$weekNumber = null;
				}
			} 
			else
			{
				$weekNumber = null;			
			}
			if (isset($aArgs['repeat_times']))
			{
				$iCount = (int) $aArgs['repeat_times'];
			}
			if (isset($aArgs['repeat_until']))
			{
				$sTime = '00:00';
				if (!empty($aArgs['time_from']))
				{
					$sTime = $aArgs['time_from'];
				}
				$oDTUntil = $this->PrepareDateTime($aArgs['repeat_until'], $sTime);
				$oUntil = new Sabre_VObject_Property_DateTime('UNTIL');
				$oUntil->setDateTime($oDTUntil, Sabre_VObject_Property_DateTime::UTC);
				$sUntil = $oUntil->value;
			}
			if (isset($aArgs['repeat_order']))
			{
				$iInterval = (int) $aArgs['repeat_order'];
			}
			if (isset($aArgs['repeat_end']))
			{
				$iEnd = (int) $aArgs['repeat_end'];
				if ($iEnd < 0 || $iEnd > 3)
				{
					$iEnd = 0;
				}
			}

			if($iEnd == 0)
			{
				$rRule = 'FREQ=' . $sFreq . ';INTERVAL=' . $iInterval;
			}
			else if ($iEnd == 1)
			{
				$rRule = 'FREQ=' . $sFreq . ";INTERVAL=" . $iInterval .";COUNT=" . $iCount;
			}
			else if ($iEnd == 2)
			{
				$rRule = 'FREQ=' . $sFreq . ";INTERVAL=" . $iInterval . ";UNTIL=" . $sUntil;
			}        

			$aByDays = array();
			$sByDay = '';
			if ($sFreq == 'WEEKLY' || $sFreq == 'MONTHLY' || $sFreq == 'YEARLY')
			{
				if (!empty($aArgs['sun'])) $aByDays[] = 'SU';
				if (!empty($aArgs['mon'])) $aByDays[] = 'MO';
				if (!empty($aArgs['tue'])) $aByDays[] = 'TU';
				if (!empty($aArgs['wed'])) $aByDays[] = 'WE';
				if (!empty($aArgs['thu'])) $aByDays[] = 'TH';
				if (!empty($aArgs['fri'])) $aByDays[] = 'FR';
				if (!empty($aArgs['sat'])) $aByDays[] = 'SA';
			}
			if (count($aByDays) > 0)
			{
				$sByDay = implode(',', $aByDays);
				if ($sFreq == 'WEEKLY')
				{
					$rRule .= ';BYDAY='.$sByDay;
				}
				if (($sFreq == 'MONTHLY' || $sFreq == 'YEARLY') && isset($weekNumber))
				{
					if ($weekNumber == 0) $sByDay = '1'.$sByDay;
					if ($weekNumber == 1) $sByDay = '2'.$sByDay;
					if ($weekNumber == 2) $sByDay = '3'.$sByDay;
					if ($weekNumber == 3) $sByDay = '4'.$sByDay;
					if ($weekNumber == 4) $sByDay = '-1'.$sByDay;
					$rRule .= ';BYDAY='.$sByDay;
				}
			}
		}
        return $rRule;
    } 	
	
	public function ParseRRULE($vcal, $uid)
	{
		$res = array();
		$aPeriods = array(
			'secondly', 
			'minutely', 
			'hourly', 
			'daily', 
			'weekly', 
			'monthly', 
			'yearly'
		);

		$res['event_repeats'] = '1';
		$res['repeat_period'] = '0';
		$res['repeat_order'] = '1';
		$res['repeat_end'] = '0';
		$res['repeat_until'] = null;
		$res['sun'] = '0';
		$res['mon'] = '0';
		$res['tue'] = '0';
		$res['wed'] = '0';
		$res['thu'] = '0';
		$res['fri'] = '0';
		$res['sat'] = '0'; 		
		
		$oRecur = null;
		$oRecur = new Sabre_VObject_RecurrenceIterator($vcal, $uid);

		if (isset($oRecur))
		{
			if (isset($oRecur->frequency))
			{
				$isPosiblePeriod = array_search($oRecur->frequency, $aPeriods);
				if ($isPosiblePeriod !== false)
				{
					$res['repeat_period'] = (string) ($isPosiblePeriod - 3);
				}
			}
			if (isset($oRecur->bySetPos))
			{
				$res['week_number'] = $oRecur->bySetPos;
			}
			if (isset($oRecur->interval))
			{
				$res['repeat_order'] = $oRecur->interval;
			}
			if (isset($oRecur->count))
			{
				$res['repeat_num'] = $oRecur->count;
			}	
			if (isset($oRecur->until))
			{
				$oRecur->until->setTimezone(new DateTimeZone($this->TimeZone));
				$res['repeat_until'] = $oRecur->until->format('Y-m-d H:i:s');
			}
			if (isset($res['repeat_num']))
			{
				$res['repeat_end'] = '1';
			}
			if (isset($res['repeat_until']))
			{
				$res['repeat_end'] = '2';
			}
			if (isset($oRecur->byDay))
			{
				foreach ($oRecur->byDay as $day)
				{
					if (strlen($day) > 2)
					{
						$num = (int)substr($day, 0, -2);

						if ($num == 1) $res['week_number'] = '0';
						if ($num == 2) $res['week_number'] = '1';
						if ($num == 3) $res['week_number'] = '2';
						if ($num == 4) $res['week_number'] = '3';
						if ($num == -1) $res['week_number'] = '4';
					}

					if (strpos($day, 'SU') !== false) $res['sun'] = '1';
					if (strpos($day, 'MO') !== false) $res['mon'] = '1';
					if (strpos($day, 'TU') !== false) $res['tue'] = '1';
					if (strpos($day, 'WE') !== false) $res['wed'] = '1';
					if (strpos($day, 'TH') !== false) $res['thu'] = '1';
					if (strpos($day, 'FR') !== false) $res['fri'] = '1';
					if (strpos($day, 'SA') !== false) $res['sat'] = '1';
				}
			}			
		}
		return $res;
	}
	
	public function GetStrDate($dt, $format = 'Y-m-d H:i:s')
	{
		$parsedDT = null;
		if ($dt instanceof Sabre_VObject_Property_DateTime)
		{
			$parsedDT = $dt->getDateTime();
		}
		if ($dt instanceof Sabre_VObject_Property_MultiDateTime)
		{
			$parsedDT = $dt->getDateTimes();
			$parsedDT = current($parsedDT);
		}
		if (isset($parsedDT))
		{
			$parsedDT->setTimezone(new DateTimeZone($this->TimeZone));
			return $parsedDT->format($format);
		}
		return null;
	}
}