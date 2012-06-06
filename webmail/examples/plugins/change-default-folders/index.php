<?php

class_exists('CApi') or die();

class CChangeDefautFoldersPlugin extends AApiPlugin
{
	/**
	 * @param CApiPluginManager $oPluginManager
	 */
	public function __construct(CApiPluginManager $oPluginManager)
	{
		parent::__construct('1.0', $oPluginManager);

		$this->AddHook('api-domain-construct', 'PluginDomainConstruct');
	}

	/**
	 * @param CDomain $oDomain
	 */
	public function PluginDomainConstruct(&$oDomain)
	{
		$aFolderMap =& $oDomain->GetFoldersMap();
		$aFolderMap = array(
			EFolderType::Inbox => 'INBOX',
			EFolderType::Trash => 'Trash'
		);
	}
}

return new CChangeDefautFoldersPlugin($this);
