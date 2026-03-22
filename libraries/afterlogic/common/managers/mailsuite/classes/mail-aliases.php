<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Mailsuite
 * @subpackage Classes
 */

/**
 * @property int $IdAccount
 * @property string $Email
 * @property array $Aliases
 *
 * @package Mailsuite
 * @subpackage Classes
 */
class CMailAliases extends api_AContainer
{

	/**
	 * @param CAccount $oAccount
	 */
	public function __construct($oAccount)
	{
		parent::__construct(get_class($this), 'IdAccount');

		$this->SetDefaults(array(
			'IdAccount'	=> $oAccount->IdAccount,
			'Email'		=> $oAccount->Email,
			'Aliases'	=> array()
		));
	}
	
	/**
	 * @return array
	 */
	public function GetMap()
	{
		return self::GetStaticMap();
	}

	/**
	 * @return array
	 */
	public static function GetStaticMap()
	{
		return array(
			'IdAccount'	=> array('int', 'id_acct', false),
			'Email'		=> array('string(255)', 'email'),
			'Aliases'	=> array('array')
		);
	}
}
