<?php

class CApiContactsSyncCsv
{
	/**
	 * @var CApiContactsManager
	 */
	protected $oApiContactsManager;

	/**
	 * @var CApiContactsCsvFormatter
	 */
	protected $oFormatter;

	/**
	 * @var CApiContactsCsvParser
	 */
	protected $oParser;

	/**
	 * @var CIcsReader
	 */
	protected $oReader;

	public function __construct($oApiContactsManager)
	{
		$this->oApiContactsManager = $oApiContactsManager;
		$this->oFormatter = new CApiContactsCsvFormatter();
		$this->oParser = new CApiContactsCsvParser();
	}

	/**
	 * @param int $iUserId
	 * @return string
	 */
	public function Export($iUserId)
	{
		$iOffset = 0;
		$iRequestValue = 50;

		$sResult = '';

		$iCount = $this->oApiContactsManager->GetContactItemsCount($iUserId);
		if (0 < $iCount)
		{
			while ($iOffset < $iCount)
			{
				$aList = $this->oApiContactsManager->GetContactItemsWithoutOrder($iUserId, $iOffset, $iRequestValue);

				if (is_array($aList))
				{
					$oContactListItem = null;
					foreach ($aList as $oContactListItem)
					{
						$oContact = $this->oApiContactsManager->GetContactById($iUserId, $oContactListItem->Id);
						if ($oContact)
						{
							$this->oFormatter->SetContainer($oContact);
							$this->oFormatter->Form();
							$sResult .= $this->oFormatter->GetValue();
						}
					}

					$iOffset += $iRequestValue;
				}
				else
				{
					break;
				}
			}
		}

		return $sResult;
	}

	/**
	 * @param int $iUserId
	 * @param string $sTempFileName
	 * @param int $iParsedCount
	 * @return int
	 */
	public function Import($iUserId, $sTempFileName, &$iParsedCount)
	{
		$iCount = -1;
		$iParsedCount = 0;
		if (file_exists($sTempFileName))
		{
			$aCsv = api_Utils::CsvToArray($sTempFileName);
			if (is_array($aCsv))
			{
				$iCount = 0;
				foreach ($aCsv as $aCsvItem)
				{
					$this->oParser->Reset();

					$oContact = new CContact();
					$oContact->IdUser = $iUserId;

					$this->oParser->SetContainer($aCsvItem);
					$aParameters = $this->oParser->GetParameters();

					foreach ($aParameters as $sPropertyName => $mValue)
					{
						if ($oContact->IsProperty($sPropertyName))
						{
							$oContact->{$sPropertyName} = $mValue;
						}
					}
					
					$oContact->InitDependentValues();
					
					$iParsedCount++;
					$oContact->__SKIP_VALIDATE__ = true;
					if ($this->oApiContactsManager->CreateContact($oContact))
					{
						$iCount++;
					}
					
					unset($oContact, $aParameters, $aCsvItem);
				}
			}
		}

		return $iCount;
	}
}
