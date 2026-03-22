<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Mailsuite
 */

/**
 * @package Mailsuite
 */
class CApiMailsuiteManager extends AApiManagerWithStorage
{
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('mailsuite', $oManager);
		
		$this->inc('classes.mailing-list');
		$this->inc('classes.mail-aliases');
		$this->inc('classes.mail-forwards');
	}

	/**
	 * @param int $iMailingListId
	 * @return CMailingList
	 */
	public function GetMailingListById($iMailingListId)
	{
		$oMailingList = null;
		try
		{
			$oMailingList = $this->oStorage->GetMailingListById($iMailingListId);
		}
		catch (CApiBaseException $oException)
		{
			$this->setLastException($oException);
		}
		return $oMailingList;
	}
	
	/**
	 * @param CMailAliases &$oMailAliases
	 */
	public function InitMailAliases(CMailAliases &$oMailAliases)
	{
		try
		{
			$this->oStorage->InitMailAliases($oMailAliases);
		}
		catch (CApiBaseException $oException)
		{
			$this->setLastException($oException);
		}
	}
	
	/**
	 * @param CMailForwards &$oMailForwards
	 */
	public function InitMailForwards(CMailForwards &$oMailForwards)
	{
		try
		{
			$this->oStorage->InitMailForwards($oMailForwards);
		}
		catch (CApiBaseException $oException)
		{
			$this->setLastException($oException);
		}
	}

	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function CreateMailingList(CMailingList &$oMailingList)
	{
		$bResult = false;
		try
		{
			if ($oMailingList->Validate())
			{
				if (!$this->MailingListExists($oMailingList))
				{
					if (!$this->oStorage->CreateMailingList($oMailingList))
					{
						throw new CApiManagerException(Errs::MailSuiteManager_MailingListCreateFailed);
					}
				}
				else
				{
					throw new CApiManagerException(Errs::MailSuiteManager_MailingListAlreadyExists);
				}
			}

			$bResult = true;
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}

	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function UpdateMailingList(CMailingList &$oMailingList)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oStorage->UpdateMailingList($oMailingList);
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}
		return $bResult;
	}
	
	/**
	 * @param int $iMailingListId
	 * @return bool
	 */
	public function DeleteMailingListById($iMailingListId)
	{
		$bResult = false;
		try
		{
			if (!$this->oStorage->DeleteMailingListById($iMailingListId))
			{
				throw new CApiManagerException(Errs::MailSuiteManager_MailingListDeleteFailed);
			}

			$bResult = true;
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}

	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function DeleteMailingList(CMailingList &$oMailingList)
	{
		$bResult = false;
		try
		{
			if ($oMailingList->Validate())
			{
				if ($this->MailingListExists($oMailingList))
				{
					if (!$this->oStorage->DeleteMailingList($oMailingList))
					{
						throw new CApiManagerException(Errs::MailSuiteManager_MailingListDeleteFailed);
					}
				}
			}

			$bResult = true;
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}

		return $bResult;
	}

	/**
	 * @param CMailAliases &$oMailAliases
	 * @return bool
	 */
	public function UpdateMailAliases(CMailAliases &$oMailAliases)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oStorage->UpdateMailAliases($oMailAliases);
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}
		return $bResult;
	}

	/**
	 * @param CMailForwards &$oMailForwards
	 * @return bool
	 */
	public function UpdateMailForwards(CMailForwards &$oMailForwards)
	{
		$bResult = false;
		try
		{
			$bResult = $this->oStorage->UpdateMailForwards($oMailForwards);
		}
		catch (CApiBaseException $oException)
		{
			$bResult = false;
			$this->setLastException($oException);
		}
		return $bResult;
	}
	
	/**
	 * @param CMailAliases &$oMailAliases
	 * @return bool
	 */
	public function DeleteMailAliases(CAccount $oAccount)
	{
		if (!$this->oStorage->UpdateMailAliases(new CMailAliases($oAccount)))
		{
			$this->lastErrorCode = $this->oMailsuiteApi->GetLastErrorCode();
			$this->lastErrorMessage = $this->oMailsuiteApi->GetLastErrorMessage();
			return false;
		}
		return true;
	}

	/**
	 * @param CMailForwards &$oMailForwards
	 * @return bool
	 */
	public function DeleteMailForwards(CAccount $oAccount)
	{
		if (!$this->oStorage->UpdateMailForwards(new CMailForwards($oAccount)))
		{
			$this->lastErrorCode = $this->oMailsuiteApi->GetLastErrorCode();
			$this->lastErrorMessage = $this->oMailsuiteApi->GetLastErrorMessage();
			return false;
		}
		return true;
	}

	/**
	 * @param CMailingList $oMailingList
	 * @return bool
	 */
	public function MailingListExists(CMailingList $oMailingList)
	{
		/* @var $oApiUsersManager CApiUsersManager */
		$oApiUsersManager = CApi::Manager('users');
		return $oApiUsersManager->AccountExists($oMailingList->GenerateAccount());
	}
}
