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
class CApiMailsuiteDbStorage extends CApiMailsuiteStorage
{
	/**
	 * @var CDbStorage $oConnection
	 */
	protected $oConnection;
	
	/**
	 * @var CApiMailsuiteCommandCreator
	 */
	protected $oCommandCreator;
	
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('db', $oManager);
				
		$this->oConnection =& $oManager->GetConnection();
		$this->oCommandCreator =& $oManager->GetCommandCreator(
			$this, array(EDbType::MySQL => 'CApiMailsuiteCommandCreatorMySQL')
		);
	}

	/**
	 * @param int $iMailingListId
	 * @return CMailingList
	 */
	public function GetMailingListById($iMailingListId)
	{
		$oMailingList = null;
		if ($this->oConnection->Execute($this->oCommandCreator->GetMailingListById($iMailingListId)))
		{
			$oRow = $this->oConnection->GetNextRecord();
			
			if ($oRow)
			{
				/* @var $oApiDomainsManager CApiDomainsManager */
				$oApiDomainsManager = CApi::Manager('domains');
				
				$oDomain = null;
				$iDomainId = $oRow->id_domain;
				if (0 < $iDomainId)
				{
					$oDomain = $oApiDomainsManager->GetDomainById($iDomainId);
				}
				else
				{
					$oDomain = $oApiDomainsManager->GetDefaultDomain();
				}

				if ($oDomain)
				{
					$oMailingList = new CMailingList($oDomain);
					$oMailingList->InitByDbRow($oRow);
					$this->initMailingListMembers($oMailingList);
				}
			}
		}

		$this->throwDbExceptionIfExist();
		return $oMailingList;
	}

	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function CreateMailingList(CMailingList &$oMailingList)
	{
		$bResult = false;
		if ($this->oConnection->Execute($this->oCommandCreator->CreateMailingList($oMailingList)))
		{
			$oMailingList->IdMailingList = $this->oConnection->GetLastInsertId();
			$this->updateMailingListMembers($oMailingList);
			$bResult = true;
		}

		$this->throwDbExceptionIfExist();
		return $bResult;
	}

	/**
	 * @param CMailingList $oMailingList
	 * @return bool
	 */
	public function UpdateMailingList(CMailingList $oMailingList)
	{
		$result = true;
		$result = $this->updateMailingListMembers($oMailingList);
		$this->throwDbExceptionIfExist();
		return $result;
	}
	
	/**
	 * @param int $iMailingListId
	 * @return bool
	 */
	public function DeleteMailingListById($iMailingListId)
	{
		$bResult = false;
		if ($this->oConnection->Execute($this->oCommandCreator->DeleteMailingListById($iMailingListId)))
		{
			if ($this->oConnection->Execute(
				$this->oCommandCreator->ClearMailingListMembers($iMailingListId)))
				$bResult = true;
		}

		$this->throwDbExceptionIfExist();
		return $bResult;
	}

	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function DeleteMailingList(CMailingList $oMailingList)
	{
		$bResult = false;
		if ($this->oConnection->Execute($this->oCommandCreator->DeleteMailingListById($oMailingList->IdMailingList)))
		{
			if ($this->oConnection->Execute(
				$this->oCommandCreator->ClearMailingListMembers($oMailingList->IdMailingList)))
				$bResult = true;
		}

		$this->throwDbExceptionIfExist();
		return $bResult;
	}
	
	/**
	 * @param CMailingList &$oMailingList
	 */
	protected function initMailingListMembers(CMailingList &$oMailingList)
	{
		if ($oMailingList && $this->oConnection->Execute(
			$this->oCommandCreator->GetMailingListMembersById($oMailingList->IdMailingList)))
		{
			$oRow = null;
			$aMailingList = array();
			while (false !== ($oRow = $this->oConnection->GetNextRecord()))
			{
				$aMailingList[] = $oRow->list_to;
			}

			$oMailingList->Members = $aMailingList;
		}

		$this->throwDbExceptionIfExist();
	}
	
	/**
	 * @param CMailingList $oMailingList
	 */
	protected function updateMailingListMembers(CMailingList $oMailingList)
	{
		$result1 = $result2 = true;
		if ($oMailingList)
		{
			$result1 = $this->oConnection->Execute(
				$this->oCommandCreator->ClearMailingListMembers($oMailingList->IdMailingList));

			if (0 < count($oMailingList->Members))
			{
				$result2 = $this->oConnection->Execute(
					$this->oCommandCreator->AddMailingListMembers($oMailingList));
			}
		}
		$this->throwDbExceptionIfExist();
		return ($result1 && $result2) ? true : false;
	}
	
	/**
	 * @param CMailAliases &$oMailAliases
	 */
	public function InitMailAliases(CMailAliases &$oMailAliases)
	{
		if ($oMailAliases && $this->oConnection->Execute(
			$this->oCommandCreator->GetMailAliasesById($oMailAliases->IdAccount)))
		{
			$oRow = null;
			$aMailAliases = array();
			while (false !== ($oRow = $this->oConnection->GetNextRecord()))
			{
				$aMailAliases[] = $oRow->alias_name . '@' . $oRow->alias_domain;
			}

			$oMailAliases->Aliases = $aMailAliases;
		}

		$this->throwDbExceptionIfExist();
	}
	
	/**
	 * @param CMailAliases $oMailAliases
	 */
	public function UpdateMailAliases(CMailAliases $oMailAliases)
	{
		$result1 = $result2 = true;
		if ($oMailAliases)
		{
			$result1 = $this->oConnection->Execute(
				$this->oCommandCreator->ClearMailAliases($oMailAliases->IdAccount));

			if (0 < count($oMailAliases->Aliases))
			{
				$aAliases = array();
				foreach (array_unique($oMailAliases->Aliases) as $aAlias)
				{
					list($sAliasName, $sAliasDomain) = explode('@', $aAlias, 2);
					$add1 = $add2 = false;
					$result = $this->oConnection->Execute(
						$this->oCommandCreator->IsAliasValidToCreateInAccounts($aAlias));
					if ($result)
					{
						$row = $this->oConnection->GetNextRecord();
						if (is_object($row))
						{
							if (0 === (int) $row->cnt)
							{
								$add1 = true;
							}
						}
					}
					$result = $this->oConnection->Execute(
						$this->oCommandCreator->IsAliasValidToCreateInAliases($sAliasName, $sAliasDomain));
					if ($result)
					{
						$row = $this->oConnection->GetNextRecord();
						if (is_object($row))
						{
							if (0 === (int) $row->cnt)
							{
								$add2 = true;
							}
						}
					}
					if ($add1 && $add2)
					{
						$aAliases[] = $aAlias; 
					}
				}
				$oMailAliases->Aliases = $aAliases;
				
				$result2 = $this->oConnection->Execute(
					$this->oCommandCreator->AddMailAliases($oMailAliases));
			}
		}
		$this->throwDbExceptionIfExist();
		return ($result1 && $result2) ? true : false;
	}
	
	/**
	 * @param CMailForwards $oMailForwards
	 */
	public function InitMailForwards(CMailForwards &$oMailForwards)
	{
		if ($oMailForwards && $this->oConnection->Execute(
			$this->oCommandCreator->GetMailForwardsById($oMailForwards->IdAccount)))
		{
			$oRow = null;
			$aMailForwards = array();
			while (false !== ($oRow = $this->oConnection->GetNextRecord()))
			{
				$aMailForwards[] = $oRow->forward_to;
			}

			$oMailForwards->Forwards = $aMailForwards;
		}

		$this->throwDbExceptionIfExist();
	}
	
	/**
	 * @param CMailForwards $oMailForwards
	 */
	public function UpdateMailForwards(CMailForwards $oMailForwards)
	{
		$result1 = $result2 = true;
		if ($oMailForwards)
		{
			$result1 = $this->oConnection->Execute(
				$this->oCommandCreator->ClearMailForwards($oMailForwards->IdAccount));

			if (0 < count($oMailForwards->Forwards))
			{
				$oMailForwards->Forwards = array_unique($oMailForwards->Forwards);
				$result2 = $this->oConnection->Execute(
					$this->oCommandCreator->AddMailForwards($oMailForwards));
			}
		}
		$this->throwDbExceptionIfExist();
		return ($result1 && $result2) ? true : false;
	}	
}
