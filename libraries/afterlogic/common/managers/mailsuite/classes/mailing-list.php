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
 * @property int $IdMailingList
 * @property int $IdDomain
 * @property string $Email
 * @property array $Members
 *
 * @package Mailsuite
 * @subpackage Classes
 */
class CMailingList extends api_AContainer
{
	/**
	 * @var CDomain
	 */
	protected $oDomain;

	/**
	 * @param CDomain $oDomain = null
	 */
	public function __construct($oDomain = null)
	{
		parent::__construct(get_class($this), 'IdMailingList');

		$this->oDomain = $oDomain;
		
		$this->SetDefaults(array(
			'IdMailingList'		=> 0,
			'IdDomain'			=> ($oDomain) ? $oDomain->IdDomain : 0,
			'Email'				=> '',
			'Members'			=> array(),

			'_Login'			=> '',
			'_IsMailingList'	=> true,
			'_IsDefaultAccount'	=> true
		));
	}
	
	/**
	 * @param string $sLogin
	 * @param string $sAtChar = '@'
	 */
	public function InitLoginAndEmail($sLogin, $sAtChar = '@')
	{
		$this->Email = '';

		$sLoginPart = api_Utils::GetAccountNameFromEmail($sLogin);
		$sDomainName = ($this->oDomain) ? $this->oDomain->Name : '';
		if (!empty($sDomainName))
		{
			$this->Email = $sLoginPart.$sAtChar.$sDomainName;
		}
		
		$this->_Login = $this->Email;
	}

	/**
	 * @return bool
	 */
	public function InitBeforeChange()
	{
		$this->_Login = $this->Email;
		$this->_IsMailingList = true;
		$this->_IsDefaultAccount = true;
		return true;
	}

	/**
	 * @return CAccount
	 */
	public function GenerateAccount()
	{
		$this->InitBeforeChange();

		CApi::Manager('users');

		$oAccount = new CAccount($this->oDomain);
		
		$oAccount->Email = $this->Email;
		$oAccount->IncomingMailLogin = $this->_Login;
		$oAccount->IsDefaultAccount = $this->_IsDefaultAccount;
		$oAccount->IsMailingList = $this->_IsMailingList;

		return $oAccount;
	}

	/**
	 * @return bool
	 */
	public function Validate()
	{
		$this->InitBeforeChange();
		
		switch (true)
		{
			case ($this->IdDomain < 1):
				throw new CApiValidationException(Errs::MailSuiteManager_MailingListInvalid);
				
			case (api_Validate::IsEmpty($this->Email)):
				throw new CApiValidationException(Errs::Validation_FieldIsEmpty, null, array(
					'{{ClassName}}' => 'CMailingList', '{{ClassField}}' => 'Email'));
				
			case (api_Validate::IsEmpty($this->_Login)):
				throw new CApiValidationException(Errs::Validation_FieldIsEmpty, null, array(
					'{{ClassName}}' => 'CMailingList', '{{ClassField}}' => '_Login'));
		}

		return true;
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
			'IdMailingList'	=> array('int', 'id_acct', false),
			'IdDomain'		=> array('int', 'id_domain'),
			'Email'			=> array('string(255)', 'email'),
			'Members'		=> array('array'),

			'_Login'				=> array('string(255)', 'mail_inc_login'),
			'_IsMailingList'		=> array('bool', 'mailing_list'),
			'_IsDefaultAccount'		=> array('bool', 'def_acct'),
		);
	}
}
