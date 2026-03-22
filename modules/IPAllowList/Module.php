<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\IPAllowList;

use Aurora\Modules\Core\Models\User;
use Aurora\System\Exceptions\ApiException;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Settings $oModuleSettings
 *
 * @package Modules
 */
class Module extends \Aurora\System\Module\AbstractModule
{
    public function init()
    {
        $this->aErrors = [
            Enums\ErrorCodes::IpIsNotAllowed => $this->i18N('ERROR_IP_IS_NOT_ALLOWED'),
        ];

        $this->subscribeEvent('Core::Login::before', array($this, 'onBeforeLogin'));
        $this->subscribeEvent('System::RunEntry::before', [$this, 'onBeforeRunEntry'], 100);
    }

    /**
     * @return Module
     */
    public static function getInstance()
    {
        return parent::getInstance();
    }

    /**
     * @return Module
     */
    public static function Decorator()
    {
        return parent::Decorator();
    }

    /**
     * @return Settings
     */
    public function getModuleSettings()
    {
        return $this->oModuleSettings;
    }

    public function GetSettings()
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return [
            'CurrentIP' => $this->_getCurrentIp()
        ];
    }

    /**
     * Obtains user settings. Method is allowed for superadmin only.
     *
     * @param int $UserId
     * @return array|null
     */
    public function GetUserSettings($UserId)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $oUser = \Aurora\System\Api::getUserById($UserId);
        if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
            $aList = $this->GetIpAllowlist($oUser);
            $bIpAllowlistEnabled = (count($aList) > 0);
            return [
                'IpAllowlistEnabled' => $bIpAllowlistEnabled
            ];
        }

        return null;
    }

    public function DisableUserIpAllowlist($UserId)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);

        $mResult = false;
        $oUser = \Aurora\System\Api::getUserById($UserId);
        if ($oUser instanceof User && $oUser->isNormalOrTenant()) {
            $oUser->setExtendedProp(self::GetName() . '::IPAllowList', \json_encode([]));
            $mResult = $oUser->save();
        }
        return $mResult;
    }

    public function GetIpAllowlist($User = null)
    {
        if ($User === null) {
            $User = \Aurora\System\Api::getAuthenticatedUser();
        } else {
            \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::SuperAdmin);
        }
        $aList = [];
        if ($User instanceof User) {
            if (null !== $User->getExtendedProp(self::GetName() . '::IPAllowList')) {
                $aList = \json_decode($User->getExtendedProp(self::GetName() . '::IPAllowList'), true);
            }
        }

        return $aList;
    }

    public function AddIpToAllowlist($IP, $Comment)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $mResult = false;
        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser instanceof User) {
            $aList = $this->GetIpAllowlist();
            $aList[$IP] = ['Comment' => $Comment];
            $oUser->setExtendedProp(self::GetName() . '::IPAllowList', \json_encode($aList));
            $mResult = $oUser->save();
        }

        return $mResult;
    }

    public function RemoveIpFromAllowlist($IP)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        $mResult = false;
        $oUser = \Aurora\System\Api::getAuthenticatedUser();
        if ($oUser instanceof User) {
            $aList = $this->GetIpAllowlist();
            if (isset($aList[$IP])) {
                unset($aList[$IP]);
                $oUser->setExtendedProp(self::GetName() . '::IPAllowList', \json_encode($aList));
                $mResult = $oUser->save();
            }
        }
        return $mResult;
    }

    protected function _getCurrentIp()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            return $_SERVER['REMOTE_ADDR'];
        }
    }

    protected function checkIpAddress($oUser = null)
    {
        $sIpAddress = $this->_getCurrentIp();
        $aList = $this->GetIpAllowlist($oUser);
        if (is_array($aList) && count($aList) > 0) {
            if (!in_array($sIpAddress, array_keys($aList))) {
                \Aurora\System\Api::LogEvent('access-denied: ' . $oUser->PublicId, self::GetName());
                throw new ApiException(Enums\ErrorCodes::IpIsNotAllowed, null, '', [], $this);
            }
        }
    }

    public function onBeforeRunEntry($aArgs, &$mResult)
    {
        $aEntries = ['api', 'download'];
        if (isset($aArgs['EntryName']) && in_array(strtolower($aArgs['EntryName']), $aEntries)) {
            $this->checkIpAddress();
        }
    }

    public function onBeforeLogin($aArgs, &$mResult)
    {
        if (isset($aArgs['Login']) && isset($aArgs['Password'])) {
            $aAuthData = \Aurora\Modules\Core\Module::Decorator()->Authenticate($aArgs['Login'], $aArgs['Password']);
            if (is_array($aAuthData) && isset($aAuthData['id'])) {
                $oUser = \Aurora\Api::getUserById($aAuthData['id']);
                if ($oUser) {
                    \Aurora\Api::skipCheckUserRole(true);
                    $this->checkIpAddress($oUser);
                    \Aurora\Api::skipCheckUserRole(false);
                }
            }
        }
    }
}
