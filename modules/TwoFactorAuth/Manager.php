<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\TwoFactorAuth;

use Aurora\Modules\TwoFactorAuth\Models\UsedDevice;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 */
class Manager extends \Aurora\System\Managers\AbstractManager
{
    /**
     * @var \Aurora\Modules\TwoFactorAuth\Module
     */
    protected $oModule = null;

    /**
     * @param \Aurora\Modules\TwoFactorAuth\Module $oModule
     */
    public function __construct(\Aurora\Modules\TwoFactorAuth\Module $oModule = null)
    {
        parent::__construct($oModule);
    }

    public function isTrustedDevicesEnabled()
    {
        $iTrustDevicesForDays = $this->oModule->getModuleSettings()->TrustDevicesForDays;
        return $this->oModule->getModuleSettings()->AllowUsedDevices && is_int($iTrustDevicesForDays) && $iTrustDevicesForDays > 0;
    }

    public function getAllDevices($iUserId)
    {
        return UsedDevice::where('UserId', $iUserId)
            ->orderBy('LastUsageDateTime', 'desc')
            ->get();
    }

    /**
     * @param int $iUserId
     * @param string $sDeviceId
     *
     * @return UsedDevice
     */
    public function getDevice($iUserId, $sDeviceId)
    {
        return UsedDevice::where('UserId', $iUserId)
            ->where('DeviceId', $sDeviceId)
            ->first();
    }

    /**
     * @param string $sDeviceId
     *
     * @return UsedDevice
     */
    public function getDeviceByDeviceId($sDeviceId)
    {
        return UsedDevice::where('DeviceId', $sDeviceId)
            ->first();
    }

    public function getDeviceByAuthToken($iUserId, $sAuthToken)
    {
        return UsedDevice::where('UserId', $iUserId)
            ->where('AuthToken', $sAuthToken)
            ->first();
    }

    public function checkDeviceAfterAuthenticate($oUser)
    {
        $bDeviceTrusted = false;
        $sDeviceId = \Aurora\System\Api::getDeviceIdFromHeaders();
        if ($sDeviceId && $this->oModule->getModuleSettings()->TrustDevicesForDays > 0) {
            $oUsedDevice = $this->getDevice($oUser->Id, $sDeviceId);
            if ($oUsedDevice) {
                if ($oUsedDevice->TrustTillDateTime > time()) {
                    $bDeviceTrusted = true;
                    $oUsedDevice->LastUsageDateTime = time();
                    $oUsedDevice->save();
                }
            }
        }
        return $bDeviceTrusted;
    }

    public function trustDevice($iUserId, $sDeviceId, $sDeviceName, $sAuthToken = '')
    {
        $oUsedDevice = $this->getDevice($iUserId, $sDeviceId);
        if (!$oUsedDevice) {
            if ($this->saveDevice($iUserId, $sDeviceId, $sDeviceName, $sAuthToken)) {
                $oUsedDevice = $this->getDevice($iUserId, $sDeviceId);
            }
        } else {
            $oUsedDevice->DeviceName = $sDeviceName;
        }

        if ($this->isTrustedDevicesEnabled()) {
            $iTrustDevicesForDays = $this->oModule->getModuleSettings()->TrustDevicesForDays;
            $oUsedDevice->TrustTillDateTime = time() + $iTrustDevicesForDays * 24 * 60 * 60;
        } else {
            $oUsedDevice->TrustTillDateTime = $oUsedDevice->CreationDateTime;
        }

        return $oUsedDevice->save();
    }

    public function setDeviceName($iUserId, $sDeviceId, $sDeviceName)
    {
        $result = false;
        $oUsedDevice = $this->getDevice($iUserId, $sDeviceId);
        if ($oUsedDevice) {
            $oUsedDevice->DeviceName = $sDeviceName;
            $result = $oUsedDevice->save();
        }

        return $result;
    }

    public function setDeviceCustomName($iUserId, $sDeviceId, $DeviceCustomName)
    {
        $result = false;
        $oUsedDevice = $this->getDevice($iUserId, $sDeviceId);
        if ($oUsedDevice) {
            $oUsedDevice->DeviceCustomName = $DeviceCustomName;
            $result = $oUsedDevice->save();
        }

        return $result;
    }

    public function saveDevice($iUserId, $sDeviceId, $sDeviceName, $sAuthToken)
    {
        $oUsedDevice = $this->getDevice($iUserId, $sDeviceId);
        if (!$oUsedDevice) {
            $oUsedDevice = $this->_createUsedDevice($iUserId, $sDeviceId, $sDeviceName);
        } else {
            if (!empty($sDeviceName)) {
                $oUsedDevice->DeviceName = $sDeviceName;
            }
            // $_SERVER['REMOTE_ADDR'] may not actually contain real client IP addresses, as it will give you a proxy address for clients connected through a proxy, for example.
            // But the client can set all HTTP header information (ie. $_SERVER['HTTP_CLIENT_IP'], $_SERVER['HTTP_X_FORWARDED_FOR']) to any arbitrary value it wants, so we cannot rely on them.
            $oUsedDevice->DeviceIP = $_SERVER['REMOTE_ADDR'];
        }

        $oUsedDevice->AuthToken = $sAuthToken;
        $oUsedDevice->LastUsageDateTime = time();

        return $oUsedDevice->save();
    }

    public function deleteDeviceByID($iId)
    {
        return !!UsedDevice::where('Id', $iId)->delete();
    }

    public function revokeTrustFromAllDevices($oUser)
    {
        $mResult = true;
        $aTrustedDevices = $this->getAllDevices($oUser->Id);
        foreach ($aTrustedDevices as $oUsedDevice) {
            $oUsedDevice->TrustTillDateTime = $oUsedDevice->CreationDateTime;
            $mResult = $mResult && $oUsedDevice->save();
        }
        return $mResult;
    }

    private function _createUsedDevice($iUserId, $sDeviceId, $sDeviceName)
    {
        $oUsedDevice = new UsedDevice();
        $oUsedDevice->UserId = $iUserId;
        $oUsedDevice->DeviceId = $sDeviceId;
        $oUsedDevice->DeviceName = $sDeviceName;
        $oUsedDevice->CreationDateTime = time();
        $oUsedDevice->TrustTillDateTime = $oUsedDevice->CreationDateTime;
        $oUsedDevice->LastUsageDateTime = $oUsedDevice->CreationDateTime;

        // $_SERVER['REMOTE_ADDR'] may not actually contain real client IP addresses, as it will give you a proxy address for clients connected through a proxy, for example.
        // But the client can set all HTTP header information (ie. $_SERVER['HTTP_CLIENT_IP'], $_SERVER['HTTP_X_FORWARDED_FOR']) to any arbitrary value it wants, so we cannot rely on them.
        $oUsedDevice->DeviceIP = $_SERVER['REMOTE_ADDR'];

        return $oUsedDevice;
    }
}
