<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Calendar
 */


class CApiCalendarManager extends AApiManagerWithStorage
{
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('calendar', $oManager);

		$this->inc('classes.colors');
		$this->inc('classes.calendar');
	}
	
	public function GetLastError()
	{
		return $this->oStorage->GetLastError();
	}

	public function CheckCalendarAccess($sUser, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->CheckCalendarAccess($sUser, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	// Calendars
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function GetCalendar($oAccount, $sCalendarId)
	{
		$oResult = false;
		try
		{
			$oResult = $this->oStorage->GetCalendar($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function GetPublicUser()
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetPublicUser();
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param string $sCalendarId
	 */
	public function GetPublicCalendar($sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetPublicCalendar($sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param string $sHash
	 */
	public function GetPublicCalendarByHash($sHash)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetPublicCalendarByHash($sHash);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param string $sCalendarId
	 */
	public function GetPublicCalendarHash($oAccount, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetPublicCalendarHash($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 */
	public function GetCalendars($oAccount)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetCalendars($oAccount);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
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
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->CreateCalendar($oAccount, $sName, $sDescription, $iOrder, $sColor);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sName
	 * @param string $sDescription
	 * @param int $iOrder
	 * @param string $sColor
	 */
	public function UpdateCalendar($oAccount, $sCalendarId, $sName, $sDescription, $iOrder, $sColor)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateCalendar($oAccount, $sCalendarId, $sName, $sDescription, $iOrder, $sColor);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param string $sCalendarId
	 * @param int $iVisible
	 */
	public function UpdateCalendarVisible($sCalendarId, $iVisible)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateCalendarVisible($sCalendarId, $iVisible);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sColor
	 */
	public function UpdateCalendarColor($oAccount, $sCalendarId, $sColor)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateCalendarColor($oAccount, $sCalendarId, $sColor);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function DeleteCalendar($oAccount, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->DeleteCalendar($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sUserId
	 * @param string $sPerms
	 */
	public function UpdateCalendarShare($oAccount, $sCalendarId, $sUserId, $sPerms = '')
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateCalendarShare($oAccount, $sCalendarId, $sUserId, $sPerms);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function PublicCalendar($oAccount, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->PublicCalendar($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnPublicCalendar($oAccount, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UnPublicCalendar($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sUserId
	 */
	public function DeleteCalendarShare($oAccount, $sCalendarId, $sUserId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->UpdateCalendarShare($oAccount, $sCalendarId, $sUserId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 */
	public function UnSubscribeCalendar($oAccount, $sCalendarId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UnSubscribeCalendar($oAccount, $sCalendarId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param FileInfo $oCalendar
	 */
	public function GetCalendarUsers($oAccount, $oCalendar)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetCalendarUsers($oAccount, $oCalendar);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	// Events

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetEvents($oAccount, $sCalendarId, $dStart = null, $dFinish = null)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetEvents($oAccount, $sCalendarId, $dStart, $dFinish);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetPublicEvents($sCalendarId, $dStart = null, $dFinish = null)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetPublicEvents($sCalendarId, $dStart, $dFinish);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function GetEvent($oAccount, $sCalendarId, $sEventId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetEvent($oAccount, $sCalendarId, $sEventId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param array $aArgs
	 */
	public function CreateEvent($oAccount, $sCalendarId, $aArgs)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->CreateEvent($oAccount, $sCalendarId, $aArgs);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sEventId
	 * @param string $sCalendarId
	 * @param string $aArgs
	 */
	public function UpdateEvent($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateEvent($oAccount, $sCalendarId, $sEventId, $aArgs);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function MoveEvent($oAccount, $sCalendarId, $sNewCalendarId, $sEventId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->MoveEvent($oAccount, $sCalendarId, $sNewCalendarId, $sEventId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 */
	public function DeleteEvent($oAccount, $sCalendarId, $sEventId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->DeleteEvent($oAccount, $sCalendarId, $sEventId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param string $recurrenceId
	 */
	public function GetExclusion($oAccount, $sCalendarId, $sEventId, $recurrenceId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetExclusion($oAccount, $sCalendarId, $sEventId, $recurrenceId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param array $aArgs
	 */
	public function UpdateExclusion($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateExclusion($oAccount, $sCalendarId, $sEventId, $aArgs);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $sEventId
	 * @param array $aArgs
	 */
	public function DeleteExclusion($oAccount, $sCalendarId, $sEventId, $aArgs)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->DeleteExclusion($oAccount, $sCalendarId, $sEventId, $aArgs);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
/**
	 * @param CAccount $oAccount
	 * @param string $sCalendarId
	 * @param string $dStart
	 * @param string $dFinish
	 */
	public function GetAlarms($oAccount, $sCalendarId, $dStart = null, $dFinish = null)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetAlarms($oAccount, $sCalendarId, $dStart, $dFinish);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function GetRemindersCache($type = 0, $start = null, $end = null)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->GetRemindersCache($type, $start, $end);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	public function CreateRemindersCache($user, $calendarUri, $type, $time, $startTime, $eventId)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->CreateRemindersCache($user, $calendarUri, $type, $time, $startTime, $eventId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	public function UpdateRemindersCache($id, $user, $calendarUri, $type, $time = null, $startTime = null, $eventId = null)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateRemindersCache($id, $user, $calendarUri, $type, $time, $startTime = null, $eventId);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function DeleteRemindersCache($calendarUri)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->DeleteRemindersCache($calendarUri);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function IcsPreprocessAppointment($oAccount, $sData)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->IcsPreprocessAppointment($oAccount, $sData);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}

	public function IcsProcessAppointment($oAccount, $bAccepted, $sCalendarId, $sData)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->IcsProcessAppointment($oAccount, $bAccepted, $sCalendarId, $sData);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}
	
	public function UpdateAppointmentRespond($oAccount, $sCalendarId, $sEventId, $sAction)
	{
		$oResult = null;
		try
		{
			$oResult = $this->oStorage->UpdateAppointmentRespond($oAccount, $sCalendarId, $sEventId, $sAction);
		}
		catch (Exception $oException)
		{
			$oResult = false;
			$this->setLastException($oException);
		}
		return $oResult;
	}	
}
