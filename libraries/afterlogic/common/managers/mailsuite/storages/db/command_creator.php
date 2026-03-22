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
class CApiMailsuiteCommandCreator extends api_CommandCreator
{
	/**
	 * @param CMailingList $oMailingList
	 * @return string
	 */
	public function CreateMailingList(CMailingList $oMailingList)
	{
		$aResults = api_AContainer::DbInsertArrays($oMailingList, $this->oHelper);
		
		if ($aResults[0] && $aResults[1])
		{
			$sSql = 'INSERT INTO %sawm_accounts ( %s ) VALUES ( %s )';
			return sprintf($sSql, $this->Prefix(),
				implode(', ', $aResults[0]), 
				implode(', ', $aResults[1])
			);
		}
		
		return '';
	}

	/**
	 * @param int $iMailingListId
	 * @return string
	 */
	public function GetMailingListById($iMailingListId)
	{
		$aMap = api_AContainer::DbReadKeys(CAccount::GetStaticMap());
		$aMap = array_map(array($this, 'escapeColumn'), $aMap);

		$sSql = 'SELECT %s FROM %sawm_accounts WHERE %s = %d';

		return sprintf($sSql, implode(', ', $aMap), $this->Prefix(),
			$this->escapeColumn('id_acct'), $iMailingListId);
	}
	
	/**
	 * @param int $iMailingListId
	 * @return string
	 */
	public function DeleteMailingListById($iMailingListId)
	{
		$sSql = 'DELETE FROM %sawm_accounts WHERE %s = %d';

		return sprintf($sSql, $this->Prefix(), $this->escapeColumn('id_acct'), $iMailingListId);
	}
	
	
	/**
	 * @param int $iMailingListId
	 * @return string
	 */
	public function GetMailingListMembersById($iMailingListId)
	{
		$sSql = 'SELECT %s FROM %sawm_mailinglists WHERE %s = %d';
		
		return sprintf($sSql, $this->escapeColumn('list_to'), $this->Prefix(),
			$this->escapeColumn('id_acct'), $iMailingListId);
	}

	/**
	 * @param int $iAccountId
	 * @return string
	 */
	public function GetMailAliasesById($iAccountId)
	{
		$sSql = 'SELECT %s, %s  FROM %sawm_mailaliases WHERE %s = %d';
		
		return sprintf($sSql, $this->escapeColumn('alias_name'), 
				$this->escapeColumn('alias_domain'), $this->Prefix(),
			$this->escapeColumn('id_acct'), $iAccountId);
	}

	/**
	 * @param int $iAccountId
	 * @return string
	 */
	public function GetMailForwardsById($iAccountId)
	{
		$sSql = 'SELECT %s FROM %sawm_mailforwards WHERE %s = %d';
		
		return sprintf($sSql, $this->escapeColumn('forward_to'), $this->Prefix(),
			$this->escapeColumn('id_acct'), $iAccountId);
	}

	/**
	 * @param CMailingList $oMailingList
	 * @return string
	 */
	public function AddMailingListMembers(CMailingList $oMailingList)
	{
		$aListSql = array();
		foreach ($oMailingList->Members as $sEmail)
		{
			$aListSql[] = '('.$oMailingList->IdMailingList.', '.$this->escapeString($oMailingList->Email).', '.$this->escapeString($sEmail).')';
		}

		if (0 < count($aListSql))
		{
			$sSql = 'INSERT INTO %sawm_mailinglists (id_acct, list_name, list_to) VALUES ';
			return sprintf($sSql, $this->Prefix()).implode(', ', $aListSql);
		}
		
		return '';
	}
	
	/**
	 * @param string $sEmail
	 * @return string
	 */
	public function IsAliasValidToCreateInAccounts($sEmail)
	{
		$sSql = 'SELECT COUNT(id_acct) AS cnt FROM %sawm_accounts WHERE email = %s AND def_acct = 1 AND deleted = 0';
		return sprintf($sSql, $this->Prefix(), $this->escapeString($sEmail));
	}

	/**
	 * @param string $sAliasName
	 * @param string $sAliasDomain
	 * @return string
	 */
	public function IsAliasValidToCreateInAliases($sAliasName, $sAliasDomain)
	{
		$sSql = 'SELECT COUNT(id) AS cnt FROM %sawm_mailaliases WHERE alias_name = %s AND alias_domain = %s';
		return sprintf($sSql, $this->Prefix(), $this->escapeString($sAliasName), $this->escapeString($sAliasDomain));
	}
	
	/**
	 * @param CMailAliases $oMailAliases
	 * @return string
	 */
	public function AddMailAliases(CMailAliases $oMailAliases)
	{
		$aListSql = array();
		foreach ($oMailAliases->Aliases as $sEmail)
		{
			list($alias_name, $alias_domain) = explode('@', $sEmail, 2);
			$aListSql[] = '('.$oMailAliases->IdAccount.', '.$this->escapeString($alias_name).', '.$this->escapeString($alias_domain).', '.$this->escapeString($oMailAliases->Email).')';
		}

		if (0 < count($aListSql))
		{
			$sSql = 'INSERT INTO %sawm_mailaliases (id_acct, alias_name, alias_domain, alias_to) VALUES ';
			return sprintf($sSql, $this->Prefix()).implode(', ', $aListSql);
		}
		
		return '';
	}

	/**
	 * @param CMailForwards $oMailForwards
	 * @return string
	 */
	public function AddMailForwards(CMailForwards $oMailForwards)
	{
		$aListSql = array();
		foreach ($oMailForwards->Forwards as $sEmail)
		{
			list($forward_name, $forward_domain) = explode('@', $oMailForwards->Email, 2);
			$aListSql[] = '('.$oMailForwards->IdAccount.', '.$this->escapeString($forward_name).', '.$this->escapeString($forward_domain).', '.$this->escapeString($sEmail).')';
		}

		if (0 < count($aListSql))
		{
			$sSql = 'INSERT INTO %sawm_mailforwards (id_acct, forward_name, forward_domain, forward_to) VALUES ';
			return sprintf($sSql, $this->Prefix()).implode(', ', $aListSql);
		}
		
		return '';
	}

	/**
	 * @param int $iMailingListId
	 * @return string
	 */
	public function ClearMailingListMembers($iMailingListId)
	{
		$sSql = 'DELETE FROM %sawm_mailinglists WHERE %s = %d';

		return sprintf($sSql, $this->Prefix(), $this->escapeColumn('id_acct'), $iMailingListId);
	}
	
	/**
	 * @param int $iAccountId
	 * @return string
	 */
	public function ClearMailAliases($iAccountId)
	{
		$sSql = 'DELETE FROM %sawm_mailaliases WHERE %s = %d';

		return sprintf($sSql, $this->Prefix(), $this->escapeColumn('id_acct'), $iAccountId);
	}
	
	/**
	 * @param int $iAccountId
	 * @return string
	 */
	public function ClearMailForwards($iAccountId)
	{
		$sSql = 'DELETE FROM %sawm_mailforwards WHERE %s = %d';

		return sprintf($sSql, $this->Prefix(), $this->escapeColumn('id_acct'), $iAccountId);
	}
}

/**
 * @package Mailsuite
 */
class CApiMailsuiteCommandCreatorMySQL extends CApiMailsuiteCommandCreator
{
}
