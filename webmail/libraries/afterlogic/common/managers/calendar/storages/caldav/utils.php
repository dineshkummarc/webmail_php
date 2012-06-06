<?php

class DAV_Convert_Utils
{
	public static function GetReminderOffset($sValue)
	{
        $sValue = str_replace('-', '', $sValue);
		$oInterval = new DateInterval($sValue);
		
		return ($oInterval->s)+($oInterval->i*60)+($oInterval->h*60*60)+
				($oInterval->d*60*60*24)+($oInterval->m*60*60*24*30)+
					($oInterval->y*60*60*24*365);		
	}

	public static function GetNextRepeat(DateTime $sDtStart, $sRepeatOrder, $sRepeatPeriod,
			$sWeekDays, $WeekNumber)
	{
		$iRepeatOrder = (int)$sRepeatOrder;
		$iRepeatPeriod = (int)$sRepeatPeriod;
		$iWeekNumber = (int)$WeekNumber + 1;
		switch($iRepeatPeriod)
		{
			case 0:
				$sDtStart->add(new DateInterval('P'.$iRepeatOrder.'D'));
				return $sDtStart;
				break;
			case 1:
				$startWeekDay = $sDtStart->format('w');
				
				$i = $startWeekDay+1;
				$daysNum = 0;
				do
				{
					$daysNum++;
					if ($i > 6) $i = 0;
					if ($sWeekDays[$i] == '1')
					{
						$sDtStart->add(new DateInterval('P'.$daysNum.'D'));
						return $sDtStart;
					}
					$i++;
				}
				while(true);
				break;
			case 2:
				$day_of_week = $sDtStart->format('w');

				$sDtStart->add(new DateInterval('P'.$iRepeatOrder.'M'));
				
				$month = $sDtStart->format('n');
				$year = $sDtStart->format('Y');
				
				$dt = $day_of_week + 7 * $iWeekNumber - 6 - date('w',mktime(0,0,0,$month,1,$year));
				$day = 1;
				if (date('w', mktime(0,0,0,$month,1,$year)) <= $day_of_week)
				{
					
					$day = $dt;
				}
				else
				{
					$day = $dt + 7;				
				}
				$sDtStart->setDate($year, $month, $day);
				return $sDtStart;
				break;
			case 3:
				$day_of_week = $sDtStart->format('w');
				$sDtStart->add(new DateInterval('P'.$iRepeatOrder.'Y'));
				$month = $sDtStart->format('n');
				$year = $sDtStart->format('Y');
				
				$dt = $day_of_week + 7 * $iWeekNumber - 6 - date('w',mktime(0,0,0,$month,1,$year));
				$day = 1;
				if (date('w', mktime(0,0,0,$month,1,$year)) <= $day_of_week)
				{
					
					$day = $dt;
				}
				else
				{
					$day = $dt + 7;				
				}
				$sDtStart->setDate($year, $month, $day);
				return $sDtStart;
				break;
				
		}
		
	}
	
	public static function getRepeatIdExclution(DateTime $sDtStart, $sDtEx, $sRepeatOrder, $sRepeatPeriod,
			$sWeekDays, $WeekNumber)
	{
		$sDtEx = Sabre_VObject_DateTimeParser:: parseDateTime($sDtEx);
		if ($sDtStart->format('Ymd') == $sDtEx->format('Ymd'))
		{
			return 0;
		}

		$result = $sDtStart;
		$repeatNum = 0;
		do
		{
			$repeatNum++;
			$result = self::GetNextRepeat($result, $sRepeatOrder, $sRepeatPeriod, $sWeekDays, $WeekNumber);
			if ($result->format('Ymd') == $sDtEx->format('Ymd'))
			{
				break;
			}
		}
		while(true);
		
		return $repeatNum;
	}	
	
	public static function _getNextRepeat(DateTime $sDtStart, $vCal, $sUid)
	{
		$oRecur = new Sabre_VObject_RecurrenceIterator($vCal, $sUid);
		$oRecur->fastForward($sDtStart);
		return $oRecur->currentDate;
	}
	
	public static function _getRepeatIdExclution($oDtEx, $vCal, $uid)
	{
		$dt = null;
		if ($oDtEx instanceof Sabre_VObject_Property_DateTime)
		{
			$dt = $oDtEx->getDateTime();
		}
		if ($oDtEx instanceof Sabre_VObject_Property_MultiDateTime)
		{
			$dt = $oDtEx->getDateTimes();
			$dt = current($dt);
		}
		$oRecur = new Sabre_VObject_RecurrenceIterator($vCal, $uid);
		if (isset($dt))
		{
			$oRecur->fastForward($dt);
		}
		return $oRecur->counter;
	}		

	/**
	 * @param int $data
	 * @param int $min
	 * @param int $max
	 * @return bool
	 */
	public static function checkData($data, $min, $max)
	{
		$data = round($data);
		return (isset($min) && isset($max)) ? ($min <= $data && $data <= $max) : ($data > 0);
	}	
}
