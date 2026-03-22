<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Calendar
 */

class CApiCalendarStorage extends AApiManagerStorage
{
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct($sStorageName, CApiGlobalManager &$oManager)
	{
		parent::__construct('calendar', $sStorageName, $oManager);
	}
	
	/**
	 * @param CAccount $oAccount
	 */
	public function Init($oAccount)
	{
	}
	
	public function IsConnected()
	{
		return false;
	}
	
	/**
	 * @param CalendarInfo  $oCalendar
	 */
	public function InitCalendar(&$oCalendar)
	{
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
		return null;
	}
	
	/*
	 * @param string $sCalendar
	 */
	public function GetPublicCalendar($sCalendar)
	{

		return false;
	}
	
	/*
	 * @param string $sHash
	 */
	public function GetPublicCalendarByHash($sHash)
	{
		return false;
	}	
	
	/*
	 * @param string $sHash
	 */
	public function GetPublicCalendarByHash_Custom($sHash)
	{
		return false;
	}	

	/*
	 * @param string $sCalendarId
	 */
	public function GetPublicCalendarHash($oAccount, $sCalendarId)
	{
		return false;	
	}	
	
	/*
	 * @param string $sCalendarId
	 */
	public function GetPublicCalendarHash_Custom($oAccount, $sCalendarId)
	{
		return false;
	}	

	/**
	 * @param CAccount $oAccount
	 */
	public function GetCalendarObjects($oAccount)
	{
		return array();
	}
	
	/**
	 * @param CAccount $oAccount
	 */
	public function GetCalendarSharedObjects($oAccount)
	{
		return array();
	}
	
	/**
	}
	 * @param CAccount $oAccount
	 */
	public function GetCalendars($oAccount)
	{
		return array();		
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
		return false;
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
		return false;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sColor
	 */
	public function UpdateCalendarColor($oAccount, $sCalendarId, $sColor)
	{
		return false;
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
		return false;
	}	

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sUserId
	 * @param string $sPerm
	 */
	public function UpdateCalendarShare_Custom($oAccount, $sCalendarId, $sUserId, $sPerms = '')
	{
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sUserId
	 * @param string $sPerm
	 */
	public function UpdateCalendarShare($oAccount, $sCalendarId, $sUserId, $sPerms = '')
	{
		return false;
	}		
	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function PublicCalendar($oAccount, $sCalendarId)
	{
		return false;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnPublicCalendar($oAccount, $sCalendarId)
	{
		return false;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnSubscribeCalendar($oAccount, $sCalendarId)
	{
		return false;
	}		
	
	/**
	 * @param CAccount $oAccount
	 * @param string $oCalendar
	 */
	public function GetCalendarUsers_Custom($oAccount, $oCalendar)	
	{
		return array();
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $oCalendar
	 */
	public function GetCalendarUsers($oAccount, $oCalendar)	
	{
		return array();
	}

	
	/**
	 * @param CalendarInfo $oCalendar
	 * @param string $sData
	 */
	public function ParseIcal($oCalendar, $sData, $onlyAlarms = false)
	{
		return array();
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetEvents($oAccount, $sCalendarId, $dStart, $dFinish)
	{
		return array();
	}
	

	/**
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetPublicEvents($sCalendarId, $dStart, $dFinish)
	{
		return array();
	}	
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function GetEvent($oAccount, $sCalendarId, $sEventId)
	{
		return array();
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param string $recurrenceId
	 */
	public function GetExclusion($oAccount, $sCalendarID, $sEventId, $recurrenceId)
	{
		return array();
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function GetEventData($oAccount, $sCalendarId, $sEventId)
	{
		return false;
	}

	/**
	}
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param array $aArgs
	 */
	public function CreateEvent($oAccount, $sCalendarId, $aArgs)
	{
		return null;
	}
	
	public function GetBaseVEventIndex($vEvent)
	{
		return -1;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param string $sData
	 */
	public function UpdateEventData($oAccount, $sCalendarId, $sEventId, $sData)
	{
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
		return false;
	}
	
	public function MoveEvent($oAccount, $sCalendarId, $sNewCalendarId, $sEventId)
	{
		return false;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function DeleteEvent($oAccount, $sCalendarId, $sEventId)
	{
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
		return false;
	}		
	
	private function isRecurrenceExists($vEvent, $sRecurrenceId)
	{
		return false;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetAlarms($oAccount, $sCalendarId, $dStart, $dFinish)
	{
		return array();
	}
	
public function GetRemindersCache($type, $start, $end)
	{
		return false;
	}
	
	public function CreateRemindersCache($user, $calendarUri, $type = 0, $time = null, $startTime = null,
			$eventid = null)
	{
		return false;
	}

	public function UpdateRemindersCache($id, $user, $calendarUri, $type, $time, $startTime, $eventid)
	{
		return false;
	}
	
	public function DeleteRemindersCache($calendarUri)
	{
		return false;
	}
	
	public function GetFirstCalendarId($oAccount)
	{
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
		return null;
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
		return false;
	}	
	
	public function IcsPreprocessAppointment($oAccount, $sData)
	{
		return false;
	}
	
	public function IcsProcessAppointment($oAccount, $sAction, $sCalendarId, $sData)
	{
		return false;
	}
	
	public function UpdateAppointmentRespond($oAccount, $sCalendarId, $sEventId, $sAction)
	{
		return false;
	}
}

