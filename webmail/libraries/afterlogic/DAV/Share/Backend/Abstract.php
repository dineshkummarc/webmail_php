<?php

abstract class afterlogic_DAV_Share_Backend_Abstract {
	
	abstract function UpdateShare($sCalendarId, $FromUser, $ToUser, $Mode);
}
