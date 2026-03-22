<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\OAuthIntegratorWebclient;

use Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 *
 * @property Module $oModule
 */
class Manager extends \Aurora\System\Managers\AbstractManager
{
    public function __construct(?\Aurora\System\Module\AbstractModule $oModule = null)
    {
        parent::__construct($oModule);
    }

    /**
     * @param int $iUserId
     * @param string $sType
     *
     * @return \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount
     */
    public function getAccount($iUserId, $sType, $sEmail = '')
    {
        $mResult = false;

        $oQuery = OauthAccount::where('IdUser', $iUserId)->where('Type', $sType);
        if (!empty($sEmail)) {
            $oQuery = $oQuery->where('Email', $sEmail);
        }
        try {
            $mResult = $oQuery->first();
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $mResult = false;
            $this->setLastException($oException);
        }
        return $mResult;
    }

    /**
     * @param string $sIdSocial
     * @param string $sType
     *
     * @return OauthAccount|bool
     */
    public function getAccountById($sIdSocial, $sType)
    {
        $mResult = false;
        try {
            $mResult = OauthAccount::where('IdSocial', $sIdSocial)->where('Type', $sType)->first();
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $mResult = false;
            $this->setLastException($oException);
        }
        return $mResult;
    }

    /**
     * @param int $iIdUser
     *
     * @return array
     */
    public function getAccounts($iIdUser)
    {
        $aResult = false;
        try {
            $aResult = OauthAccount::where('IdUser', $iIdUser)->get();
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $aResult = false;
            $this->setLastException($oException);
        }
        return $aResult;
    }

    /**
     * @param \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount &$oAccount
     *
     * @return bool
     */
    public function createAccount(OauthAccount &$oAccount)
    {
        $bResult = false;
        try {
            if ($oAccount->validate()) {
                if (!$this->isExists($oAccount)) {
                    if (!$oAccount->save()) {
                        throw new \Aurora\System\Exceptions\ManagerException(0);
                    }
                } else {
                    throw new \Aurora\System\Exceptions\ManagerException(0);
                }
            }

            $bResult = true;
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $bResult = false;
            $this->setLastException($oException);
        }

        return $bResult;
    }

    /**
     * @param \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount &$oAccount
     *
     * @return bool
     */
    public function updateAccount(OauthAccount &$oAccount)
    {
        $bResult = false;
        try {
            if ($oAccount->validate()) {
                if (!$oAccount->save()) {
                    throw new \Aurora\System\Exceptions\ManagerException(0);
                }
            }

            $bResult = true;
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $bResult = false;
            $this->setLastException($oException);
        }

        return $bResult;
    }

    /**
     * @param int $iIdUser
     * @param string $sType
     *
     * @return bool
     */
    public function deleteAccount($iIdUser, $sType, $sEmail)
    {
        $bResult = false;
        try {
            $oSocial = $this->getAccount($iIdUser, $sType, $sEmail);
            if ($oSocial) {
                if (!$oSocial->delete()) {
                    throw new \Aurora\System\Exceptions\ManagerException(0);
                }
                $bResult = true;
            }
        } catch (\Aurora\System\Exceptions\BaseException $oException) {
            $bResult = false;
            $this->setLastException($oException);
        }

        return $bResult;
    }

    /**
     * @param int $iIdUser
     *
     * @return bool
     */
    public function deleteAccountByUserId($iIdUser)
    {
        return !!OauthAccount::where('IdUser', $iIdUser)->delete();
    }

    /**
     * @param \Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount &$oAccount
     *
     * @return bool
     */
    public function isExists(OauthAccount $oAccount)
    {
        return (OauthAccount::find($oAccount->Id) instanceof OauthAccount);
    }
}
