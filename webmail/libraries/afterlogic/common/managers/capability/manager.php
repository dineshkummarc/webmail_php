<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2012 AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Capability
 */

/**
 * @package Capability
 */
class CApiCapabilityManager extends AApiManager
{
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('capability', $oManager);
	}
	
	/**
	 * @return bool
	 */
	public function HasSslSupport()
	{
		return api_Utils::HasSslSupport();
	}
	
	/**
	 * @return bool
	 */
	public function HasGdSupport()
	{
		return api_Utils::HasGdSupport();
	}
	
	/**
	 * @return bool
	 */
	public function IsCalendarSupported()
	{
		/* @var $oApiDavManager CApiDavManager */
		$oApiDavManager = CApi::Manager('dav');
		$sUrl = $oApiDavManager ? $oApiDavManager->GetServerUrl() : '';
			
		return !empty($sUrl) && api_Utils::IsPhp53();
	}
}
