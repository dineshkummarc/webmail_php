<?php

/**
 * AfterLogic Api by AfterLogic Corp. <support@afterlogic.com>
 *
 * Copyright (C) 2002-2011  AfterLogic Corp. (www.afterlogic.com)
 * Distributed under the terms of the license described in LICENSE.txt
 *
 * @package Ios
 */

require_once CApi::RootPath().'/DAV/autoload.php';

class CApiIosManager extends AApiManager
{
	private $oXmlDocument;

	/* 
	 * @var CApiUsersManager 
	 */
	private $apiUsersManager;
	
	/* 
	 * @var CApiCalendarManager 
	 */
	private $apiCalendarManager;

	/* 
	 * @var CApiDavManager 
	 */
	private $apiDavManager;	

	/**
	 * @var CAccout
	 */
	private $account;
	
	/**
	 * @param CApiGlobalManager &$oManager
	 */
	public function __construct(CApiGlobalManager &$oManager)
	{
		parent::__construct('ios', $oManager);
		
		$oDomImplementation = new DOMImplementation;
		$oDocumentType = $oDomImplementation->createDocumentType(
				'plist', 
				'-//Apple//DTD PLIST 1.0//EN', 
				'http://www.apple.com/DTDs/PropertyList-1.0.dtd'
		);		
		
		$this->oXmlDocument = $oDomImplementation->createDocument('', '', $oDocumentType);
		$this->oXmlDocument->xmlVersion = '1.0';
		$this->oXmlDocument->encoding = 'UTF-8';
		$this->oXmlDocument->formatOutput = true;

		$this->apiUsersManager = CApi::Manager('users');
		$this->apiCalendarManager = CApi::Manager('calendar');
		$this->apiDavManager = CApi::Manager('dav');

		$iUserId = CSession::Get(APP_SESSION_USER_ID);
		$iAccountId = $this->apiUsersManager->GetDefaultAccountId($iUserId);
		$this->account = $this->apiUsersManager->GetAccountById($iAccountId);
	}

	/**
	 * @return DOMElement
	 */
	private function generateDict($aPayload)
	{
		$oDictElement = $this->oXmlDocument->createElement('dict');

		foreach ($aPayload as $key => $value)
		{
			$oDictElement->appendChild($this->oXmlDocument->createElement('key', $key));
			if (is_int($value))
			{
				$oDictElement->appendChild($this->oXmlDocument->createElement('integer', $value));
			}
			else if (is_bool($value))
			{
				$oDictElement->appendChild($this->oXmlDocument->createElement($value ? 'true': 'false'));
			}
			else
			{
				$oDictElement->appendChild($this->oXmlDocument->createElement('string', $value));
			}
		}
		return $oDictElement;
	}
	
	/**
	 * @param string $sPayloadId
	 * @param CAccount $oAccount
	 * @return DOMElement
	 */
	private function generateEmailDict($sPayloadId, $oAccount)
	{
		$aEmail = array(
			'PayloadVersion'                   => 1,
			'PayloadUUID'                      => Sabre_DAV_UUIDUtil::getUUID(),
			'PayloadType'                      => 'com.apple.mail.managed',
			'PayloadIdentifier'                => $sPayloadId.'.email',
			'PayloadDisplayName'               => 'Email Account',
			'PayloadOrganization'              => $oAccount->Domain->SiteName,
			'PayloadDescription'               => 'Configures email account',
			'EmailAddress'                     => $oAccount->Email,
			'EmailAccountType'                 => EMailProtocol::IMAP4 === $oAccount->IncomingMailProtocol
				? 'EmailTypeIMAP' : 'EmailTypePOP',
			'EmailAccountDescription'          => $oAccount->Email,
			'EmailAccountName'                 => strlen($oAccount->FriendlyName) == 0
					? $oAccount->Email : $oAccount->FriendlyName,
			'IncomingMailServerHostName'       => $oAccount->IncomingMailServer,
			'IncomingMailServerPortNumber'     => $oAccount->IncomingMailPort,
			'IncomingMailServerUseSSL'         => $oAccount->IncomingMailUseSSL,
			'IncomingMailServerUsername'       => $oAccount->IncomingMailLogin,
			'IncomingPassword'                 => $oAccount->IncomingMailPassword,
			'IncomingMailServerAuthentication' => 'EmailAuthPassword',
			'OutgoingMailServerHostName'       => $oAccount->OutgoingMailServer,
			'OutgoingMailServerPortNumber'     => $oAccount->OutgoingMailPort,
			'OutgoingMailServerUseSSL'         => $oAccount->OutgoingMailUseSSL,
			'OutgoingMailServerUsername'       => strlen($oAccount->OutgoingMailLogin) == 0
					? $oAccount->IncomingMailLogin : $oAccount->OutgoingMailLogin,
			'OutgoingPassword'                 => strlen($oAccount->OutgoingMailPassword) == 0
					? $oAccount->IncomingMailPassword : $oAccount->OutgoingMailPassword,
			'OutgoingMailServerAuthentication' => ESMTPAuthType::NoAuth === $oAccount->OutgoingMailAuth
					? 'EmailAuthNone' : 'EmailAuthPassword',
		);
		
		return $this->generateDict($aEmail);
	}	

	/**
	 * @param string $sPayloadId
	 * @return DOMElement
	 */
	private function generateCaldavDict($sPayloadId)
	{
		$aCaldav = array(
			'PayloadVersion' => 1,
			'PayloadUUID' => Sabre_DAV_UUIDUtil::getUUID(),
			'PayloadType' => 'com.apple.caldav.account',
			'PayloadIdentifier' => $sPayloadId.'.caldav',
			'PayloadDisplayName' => 'CalDAV Account',
			'PayloadOrganization' => $this->account->Domain->SiteName,
			'PayloadDescription' => 'Configures CalDAV Account',
			'CalDAVAccountDescription' => $this->account->Domain->SiteName.' Calendars',
			'CalDAVHostName' => $this->apiDavManager->GetServerHost(),
			'CalDAVUsername' => $this->account->Email,
			'CalDAVPassword' => $this->account->IncomingMailPassword,
			'CalDAVUseSSL' => $this->apiDavManager->IsUseSsl(),
			'CalDAVPort' => $this->apiDavManager->GetServerPort(),
			'CalDAVPrincipalURL' => $this->apiDavManager->GetPrincipalUrl($this->account),
		);
		return $this->generateDict($aCaldav);
	}	
	
	/**
	 * @param string $sPayloadId
	 * @return DOMElement
	 */
	private function generateCarddavDict($sPayloadId)
	{
		$aCarddav = array(
			'PayloadVersion' => 1,
			'PayloadUUID' => Sabre_DAV_UUIDUtil::getUUID(),
			'PayloadType' => 'com.apple.carddav.account',
			'PayloadIdentifier' => $sPayloadId.'.carddav',
			'PayloadDisplayName' => 'CardDAV Account',
			'PayloadOrganization' => $this->account->Domain->SiteName,
			'PayloadDescription' => 'Configures CardDAV Account',
			'CardDAVAccountDescription' => $this->account->Domain->SiteName.' Contacts',
			'CardDAVHostName' => $this->apiDavManager->GetServerHost(),
			'CardDAVUsername' => $this->account->Email,
			'CardDAVPassword' => $this->account->IncomingMailPassword,
			'CardDAVUseSSL' => $this->apiDavManager->IsUseSsl(),
			'CardDAVPort' => $this->apiDavManager->GetServerPort(),
			'CardDAVPrincipalURL' => $this->apiDavManager->GetPrincipalUrl($this->account),
		);
		return $this->generateDict($aCarddav);
	}		

	/**
	 * @return string
	 */
	public function GenerateXMLProfile()
	{
		$sResult = '';
		if (isset($this->account))
		{
			$oPlist = $this->oXmlDocument->createElement('plist');
			$oPlist->setAttribute('version', '1.0');

			$sPayloadId = 'afterlogic.'.$this->apiDavManager->GetServerHost();
			$aPayload = array(
				'PayloadVersion' => 1,
				'PayloadUUID' => Sabre_DAV_UUIDUtil::getUUID(),
				'PayloadType' => 'Configuration',
				'PayloadRemovalDisallowed' => false,
				'PayloadIdentifier' => $sPayloadId,
				'PayloadOrganization' => $this->account->Domain->SiteName,
				'PayloadDescription' => $this->account->Domain->SiteName.' Mobile',
				'PayloadDisplayName' => $this->account->Domain->SiteName.' Mobile Profile',
			);

			$oArrayElement = $this->oXmlDocument->createElement('array');
			
			// Emails
			$oAccounts = AppGetAccounts($this->account);
			foreach ($oAccounts as $oAccount)
			{
				$oEmailDictElement = $this->generateEmailDict($sPayloadId, $oAccount);
				$oArrayElement->appendChild($oEmailDictElement);
			}

			if ($this->apiDavManager->TestConnection($this->account))
			{
				// Calendars
				$oCaldavDictElement = $this->generateCaldavDict($sPayloadId);
				$oArrayElement->appendChild($oCaldavDictElement);

				// Contacts
/*				$oCarddavDictElement = $this->generateCarddavDict($sPayloadId);
				$oArrayElement->appendChild($oCarddavDictElement);*/
			}			

			$oDictElement = $this->generateDict($aPayload);
			$oPayloadContentElement = $this->oXmlDocument->createElement('key', 'PayloadContent');
			$oDictElement->appendChild($oPayloadContentElement);
			$oDictElement->appendChild($oArrayElement);
			$oPlist->appendChild($oDictElement);

			$this->oXmlDocument->appendChild($oPlist);
			$sResult = $this->oXmlDocument->saveXML();
		}
		return $sResult;
	}

}
