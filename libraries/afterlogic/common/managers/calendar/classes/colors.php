<?php

class CalendarColors
{
	public static $aColors = array(
		'1'  => '#EF9554',
		'2'  => '#F58787',
		'3'  => '#6FD0CE',
		'4'  => '#90BBE0',
		'5'  => '#BAA2F3',
		'6'  => '#F68BCD',
		'7'  => '#D987DA',
		'8'  => '#4AFFB8',
		'9'  => '#9F9FFF',
		'10' => '#5CC9C9',
		'11' => '#76CB76',
		'12' => '#AEC9C9'
	);
	
	public static function GetColorValue($Number)
	{
		$result = '#AEC9C9'; 
		if (array_key_exists($Number, CalendarColors::$aColors))
		{
			$result = CalendarColors::$aColors[$Number];
		}

		return $result;
	}

	public static function GetColorNumber($Color)
	{
		$result = '12'; 
		$key = array_search($Color, CalendarColors::$aColors); 
		if ($key !== false)
		{
			$result = $key;
		}
		return $result;
	}
}
