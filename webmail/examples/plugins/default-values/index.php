<?php

class_exists('CApi') or die();

class CDefaultValuesPlugin extends AApiPlugin
{
	/**
	 * @param CApiPluginManager $oPluginManager
	 */
	public function __construct(CApiPluginManager $oPluginManager)
	{
		parent::__construct('1.0', $oPluginManager);

		$this->AddHook('api-account-construct', 'PluginApiAccountConstruct');
		$this->AddHook('api-user-construct', 'PluginApiUserConstruct');
		$this->AddHook('api-domain-construct', 'PluginApiDomainConstruct');
	}

	/**
	 * @param CAccount $oAccount
	 */
	public function PluginApiAccountConstruct(&$oAccount)
	{
		if ($oAccount instanceof CAccount)
		{
			$oAccount->MailsOnServerDays = 5;
			$oAccount->MailMode =
				EAccountMailMode::KeepMessagesOnServerAndDeleteMessageWhenItsRemovedFromTrash;
		}
	}

	/**
	 * @param CUser $oUser
	 */
	public function PluginApiUserConstruct(&$oUser)
	{
		if ($oUser instanceof CUser)
		{
			$oUser->AllowCalendar = false;
		}
	}

	/**
	 * @param CDomain $oDomain
	 */
	public function PluginApiDomainConstruct(&$oDomain)
	{
		if ($oDomain instanceof CDomain)
		{
			$oDomain->SiteName = 'TEST SITE NAME';
		}
	}
}

return new CDefaultValuesPlugin($this);