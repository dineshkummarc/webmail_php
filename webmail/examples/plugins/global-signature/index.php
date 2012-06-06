<?php

class_exists('CApi') or die();

class CGlobalSignaturePlugin extends AApiPlugin
{
	/**
	 * @param CApiPluginManager $oPluginManager
	 */
	public function __construct(CApiPluginManager $oPluginManager)
	{
		parent::__construct('1.0', $oPluginManager);

		$this->AddHook('webmail-change-message-before-send', 'PluginWebmailChangeMessageBeforeSend');
	}

	/**
	 * @param WebMailMessage $oMessage
	 * @param CAccount $oAccount
	 */
	public function PluginWebmailChangeMessageBeforeSend(&$oMessage, &$oAccount)
	{
		if ($oMessage && $oMessage->TextBodies)
		{
			$oMessage->TextBodies->AddTextBannerToBodyText(' - TEST - ');
		}
	}
}

return new CGlobalSignaturePlugin($this);
