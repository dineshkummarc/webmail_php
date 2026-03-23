<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\Min;

use Aurora\Modules\Min\Models\MinHash;

/**
 * System module provides hash-based object storage.
 *
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
    public $oManager = null;

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

    /***** private functions *****/
    /**
     * Initializes module.
     *
     * @ignore
     */
    public function init()
    {
        $this->oManager = new Manager($this);

        $this->aDeniedMethodsByWebApi = [
            'CreateMin',
            'DeleteMinByHash',
            'DeleteMinByID',
            'GetMinByHash',
            'GetMinByID',
            'UpdateMinByHash',
            'UpdateMinByID',
            'DeleteExpiredHashes',
            'generateHashId'
        ];
        $this->subscribeEvent('Core::DeleteUser::after', array($this, 'onAfterDeleteUser'));
    }

    /***** private functions *****/

    /***** public functions *****/
    public function onAfterDeleteUser($aArgs, &$mResult)
    {
        if ($mResult) {
            MinHash::where('UserId', $aArgs['UserId'])->delete();
        }
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Generates hash identifier by data array.
     *
     * @param array $aData
     * @return string
     */
    public static function generateHashId($aData)
    {
        return \md5(\implode('|', $aData));
    }

    /***** public functions might be called with web API *****/
    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Crates min hash.
     *
     * @param string $HashId Hash identifier.
     * @param array $Parameters Hash parameters.
     * @param int $UserId User identifier.
     * @param int $ExpireDate
     * @return string|boolean
     */
    public function CreateMin($HashId, $Parameters, $UserId = null, $ExpireDate = null)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        return $this->oManager->createMin($HashId, $Parameters, $UserId, $ExpireDate);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Returns parameters object by min hash.
     *
     * @param string $sHash Min hash.
     * @return array|bool
     */
    public function GetMinByHash($sHash)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return $this->oManager->getMinByHash($sHash);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Returns parameters object by min hash identifier.
     *
     * @param string $Id
     * @return array|bool
     */
    public function GetMinByID($Id)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return $this->oManager->getMinByID($Id);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Updates min hash by min hash identifier.
     *
     * @param string $Id Hash identifier.
     * @param array $Data Hash parameters.
     * @param string $NewId New hash identifier.
     * @return boolean
     */
    public function UpdateMinByID($Id, $Data, $NewId = null)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        return $this->oManager->updateMinByID($Id, $Data, $NewId);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Updates min hash by min hash.
     *
     * @param string $Hash Min hash.
     * @param array $Data Hash parameters.
     * @param string $NewHash New min hash.
     * @return boolean
     */
    public function UpdateMinByHash($Hash, $Data, $NewHash = null)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return $this->oManager->updateMinByHash($Hash, $Data, $NewHash);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Deletes min hash by min hash identifier.
     *
     * @param string $Id
     * @return boolean
     */
    public function DeleteMinByID($Id)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::NormalUser);

        return $this->oManager->deleteMinByID($Id);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Deletes min hash by min hash.
     *
     * @param string $Hash
     * @return boolean
     */
    public function DeleteMinByHash($Hash)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);

        return $this->oManager->deleteMinByHash($Hash);
    }

    /**
     * !Not public
     * This method is restricted to be called by web API (see denyMethodsCallByWebApi method).
     *
     * Deletes expired min hashes.
     *
     * @param int $Time Expire time.
     * @return void
     */
    public function DeleteExpiredHashes($Time)
    {
        \Aurora\System\Api::checkUserRoleIsAtLeast(\Aurora\System\Enums\UserRole::Anonymous);
        Models\MinHash::whereNotNull('ExpireDate')->where('ExpireDate', '<=', $Time)->delete();
    }
    /***** public functions might be called with web API *****/
}
