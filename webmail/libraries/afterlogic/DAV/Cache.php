<?php

class afterlogic_DAV_Cache{
	
	/**
	 * @var string
	 */	
	public $Id;
	
	/**
	 * @var string
	 */
	public $User;
	
	/**
	 * @var string
	 */	
	public $CalendarUri;
	
	/**
	 * @var string
	 */
	public $Type;

	/**
	 * @var string
	 */	
	public $Time;
	
	/**
	 * @var string
	 */	
	public $StartTime;
	
	/**
	 * @var string
	 */
	public $EventId;
	
	public function __construct() 
	{
        $this->Id = '';
		$this->User = '';
		$this->CalendarUri = '';
		$this->Type = '';
		$this->Time = '';
		$this->StartTime = '';
		$this->EventId = '';
 	}
}
