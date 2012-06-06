<?php

	class ap_Utils
	{
		/**
		 * @return float
		 */
		public static function Microtime()
		{
			return microtime(true);
		}

		/**
		 * @param array $aArray
		 * @param string $sKey
		 * @param mixed $mDefault
		 * @return mixed
		 */
		public static function ArrayValue($aArray, $sKey, $mDefault)
		{
			return (isset($aArray[$sKey])) ? $aArray[$sKey] : $mDefault;
		}

		/**
		 * @param string $sValue
		 * @return string
		 */
		public static function AttributeQuote($sValue)
		{
			return str_replace('\'', '&#039;', str_replace('"', '&quot;', $sValue));
		}
		
		/**
		 * @param string $sValue
		 * @return string
		 */
		public static function EncodeSpecialXmlChars($sValue)
		{
			return str_replace('>', '&gt;', str_replace('<', '&lt;', str_replace('&', '&amp;', $sValue)));
		}

		/**
		 * @param string $sValue
		 * @return string
		 */
		public static function DecodeSpecialXmlChars($sValue)
		{
			return str_replace('&amp;', '&', str_replace('&lt;', '<', str_replace('&gt;', '>', $sValue)));
		}

		/**
		 * @param string $sJsDesc
		 * @param string $sDeq = null
		 * @return string
		 */
		public static function ReBuildStringToJavaScript($sJsDesc, $sDeq = null)
		{
			$sJsDesc = self::ClearStringValue($sJsDesc, $sDeq);
			return str_replace(array("\r", "\n", "\t"), array('\r', '\n', '\t'), trim($sJsDesc));
		}

		/**
		 * @param string $sDesc
		 * @param string $sDeq = null
		 * @return string
		 */
		public static function ClearStringValue($sDesc, $sDeq = null)
		{
			$sDesc = str_replace('\\', '\\\\', $sDesc);
			if ($sDeq !== null && strlen($sDeq) == 1)
			{
				$sDesc = str_replace($sDeq, '\\'.$sDeq, $sDesc);
			}
			return $sDesc;
		}

		/**
		 * @param string $sPath
		 * @param string $sPrefix = null
		 * @return string
		 */
		public static function GetFullPath($sPath, $sPrefix = null)
		{
			if ($sPrefix !== null && !@is_dir(realpath($sPath)))
			{
				if (!self::IsFullPath($sPath))
				{
					$sPath = $sPrefix.'/'.$sPath;
				}
			}

			if (@is_dir($sPath))
			{
				$sPath = rtrim(str_replace('\\', '/', realpath($sPath)), '/');
			}

			return $sPath;
		}

		/**
		 * @param string $sPpath
		 * @return bool
		 */
		public static function IsFullPath($sPpath)
		{
			if (strlen($sPpath) > 0)
			{
				return (($sPpath{0} == '/' || $sPpath{0} == '\\') || (strlen($sPpath) > 1 && self::IsWin() && $sPpath{1} == ':'));
			}
			return false;
		}

		/**
		 * @return bool
		 */
		public static function IsWin()
		{
			return ('WIN' === strtoupper(substr(PHP_OS, 0, 3)));
		}

		/**
		 * @param array $aArray
		 * @param string $sType
		 * @return array
		 */
		public static function SetTypeArrayValue($aArray, $sType)
		{
			$aResult = array();
			foreach ($aArray as $mValue)
			{
				settype($mValue, $sType);
				$aResult[] =$mValue;
			}
			return $aResult;
		}

		/**
		 * @param string $sPrefix
		 * @return string
		 */
		public static function ClearPrefix($sPrefix)
		{
			$sNewPrefix = preg_replace('/[^a-z0-9_]/i', '_', $sPrefix);
			if ($sNewPrefix !== $sPrefix)
			{
				$sNewPrefix = preg_replace('/[_]+/', '_', $sNewPrefix);
			}
			return $sNewPrefix;
		}
		
		/**
		 * @staticvar array $aMapping
		 * @param int $iCodePage
		 * @return string
		 */
		public static function GetCodePageName($iCodePage)
		{
			static $aMapping = array(
				0 => 'default',
				51936 => 'euc-cn',
				936 => 'gb2312',
				950 => 'big5',
				946 => 'euc-kr',
				50225 => 'iso-2022-kr',
				50220 => 'iso-2022-jp',
				932 => 'shift-jis',
				65000 => 'utf-7',
				65001 => 'utf-8',
				1250 => 'windows-1250',
				1251 => 'windows-1251',
				1252 => 'windows-1252',
				1253 => 'windows-1253',
				1254 => 'windows-1254',
				1255 => 'windows-1255',
				1256 => 'windows-1256',
				1257 => 'windows-1257',
				1258 => 'windows-1258',
				20866 => 'koi8-r',
				28591 => 'iso-8859-1',
				28592 => 'iso-8859-2',
				28593 => 'iso-8859-3',
				28594 => 'iso-8859-4',
				28595 => 'iso-8859-5',
				28596 => 'iso-8859-6',
				28597 => 'iso-8859-7',
				28598 => 'iso-8859-8'
			);

			return (isset($aMapping[$iCodePage])) ? $aMapping[$iCodePage] : '';
		}

		/**
		 * @staticvar array $aMapping
		 * @param string $sCodePageName
		 * @return int
		 */
		public static function GetCodePageNumber($sCodePageName)
		{
			static $aMapping = array(
				'default' => 0,
				'euc-cn' => 51936,
				'gb2312' => 936,
				'big5' => 950,
				'euc-kr' => 949,
				'iso-2022-kr' => 50225,
				'iso-2022-jp' => 50220,
				'shift-jis' => 932,
				'utf-7' => 65000,
				'utf-8' => 65001,
				'windows-1250' => 1250,
				'windows-1251' => 1251,
				'windows-1252' => 1252,
				'windows-1253' => 1253,
				'windows-1254' => 1254,
				'windows-1255' => 1255,
				'windows-1256' => 1256,
				'windows-1257' => 1257,
				'windows-1258' => 1258,
				'koi8-r' => 20866,
				'iso-8859-1' => 28591,
				'iso-8859-2' => 28592,
				'iso-8859-3' => 28593,
				'iso-8859-4' => 28594,
				'iso-8859-5' => 28595,
				'iso-8859-6' => 28596,
				'iso-8859-7' => 28597,
				'iso-8859-8' => 28598
			);

			return (isset($aMapping[$sCodePageName])) ? $aMapping[$sCodePageName] : 0;
		}
	}

	defined('PHP_INT_MAX') || define('PHP_INT_MAX', (int) getIntMax());
	defined('PHP_INT_MIN') || define('PHP_INT_MIN', (int) (PHP_INT_MAX + 1));
	
	/**
	 * @param int $iBigInt
	 * @return int
	 */
	function GetGoodBigInt($iBigInt)
	{
		if (null === $iBigInt || false == $iBigInt)
		{
			return 0;
		}
		else if ($iBigInt > PHP_INT_MAX)
		{
			return PHP_INT_MAX;
		}
		else if ($iBigInt < PHP_INT_MIN)
		{
			return PHP_INT_MIN;
		}

		return (int) $iBigInt;
	}

	/**
	 * @return int
	 */
	function getIntMax()
	{
		$max = 0x7fff;
		$probe = 0x7fffffff;
		while ($max == ($probe >> 16))
		{
			$max = $probe;
			$probe = ($probe << 16) + 0xffff;
		}
		return $max;
	}

	function _disable_magic_quotes_gpc()
	{
		if (@get_magic_quotes_gpc() == 1)
		{
			$_GET = isset($_GET) ? _fixed_array_map_stripslashes($_GET) : array();
			$_POST = isset($_POST) ? _fixed_array_map_stripslashes($_POST) : array();
		}
	}

	/**
	 * @param	array	$_array
	 * @return	array
	 */
	function _fixed_array_map_stripslashes($_array)
	{
		if (is_array($_array))
		{
			foreach ($_array as $_key => $_value)
			{
				$_array[$_key] = (is_array($_value))
					? @_fixed_array_map_stripslashes($_value)
					: @stripslashes($_value);
			}
		}
		return $_array;
	}