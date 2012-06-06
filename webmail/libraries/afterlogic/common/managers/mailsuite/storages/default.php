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
class CApiMailsuiteStorage extends AApiManagerStorage
{
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct($sStorageName, CApiGlobalManager &$oManager)
	{
		parent::__construct('mailsuite', $sStorageName, $oManager);
	}

	/**
	 * @param int $iMailingListId
	 * @return CMailingList
	 */
	public function GetMailingListById($iMailingListId)
	{
		return null;
	}
	
	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function CreateMailingList(CMailingList &$oMailingList)
	{
		return false;
	}
	
	/**
	 * @param CMailingList &$oMailingList
	 * @return bool
	 */
	public function UpdateMailingList(CMailingList &$oMailingList)
	{
		return false;
	}
	
	/**
	 * @param CMailingList $oMailingList
	 * @return bool
	 */
	public function MailingListExists(CMailingList $oMailingList)
	{
		return false;
	}
}
