<?php

class CalendarInfo 
{
	public $Url;
	public $Default;
	public $DisplayName;
	public $CTag;
	public $ETag;
	public $Description;
	public $Color;
	public $Order;
	public $Shared;
	public $Owner;
	public $Principals;
	public $SharingLevel;

	function __construct($sUrl, $sDisplayName = null, $sCTag = null, $sETag = null, $sDescription = null, 
			$sColor = null, $sOrder = null) 
	{
		$this->Url = rtrim(urldecode($sUrl), '/');
		$this->Default = true;
		$this->DisplayName = $sDisplayName;
		$this->CTag = $sCTag;
		$this->ETag = $sETag;
		$this->Description = $sDescription;
		$this->Color = $sColor;
		$this->Order = $sOrder;
		$this->Shared = false;
		$this->Owner = '';
		$this->Principals = array();
		$this->SharingLevel = null;
	}
}