<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\TwoFactorAuth\Models;

use Aurora\System\Classes\Model;
use Aurora\Modules\Core\Models\User;

/**
 * Aurora\Modules\TwoFactorAuth\Models\UsedDevice
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 * @package Api
 * @property integer $Id
 * @property integer $UserId
 * @property string $DeviceId
 * @property string $DeviceName
 * @property string $DeviceCustomName
 * @property string $AuthToken
 * @property integer $CreationDateTime
 * @property integer $LastUsageDateTime
 * @property integer $TrustTillDateTime
 * @property string $DeviceIP
 * @property \Illuminate\Support\Carbon|null $CreatedAt
 * @property \Illuminate\Support\Carbon|null $UpdatedAt
 * @property-read mixed $entity_id
 * @method static int count(string $columns = '*')
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice find(int|string $id, array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice findOrFail(int|string $id, mixed $id, Closure|array|string $columns = ['*'], Closure $callback = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice first(array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice firstWhere(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice query()
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice where(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereAuthToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereCreationDateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereDeviceIP($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereDeviceName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\UsedDevice whereIn(string $column, mixed $values, string $boolean = 'and', bool $not = false)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereLastUsageDateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereTrustTillDateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UsedDevice whereUserId($value)
 * @mixin \Eloquent
 */
class UsedDevice extends Model
{
    protected $table = 'security_used_devices';
    protected $foreignModel = User::class;
    protected $foreignModelIdColumn = 'UserId'; // Column that refers to an external table

    protected $fillable = [
        'Id',
        'UserId',
        'DeviceId',
        'DeviceName',
        'DeviceCustomName',
        'AuthToken',
        'CreationDateTime',
        'LastUsageDateTime',
        'TrustTillDateTime',
        'DeviceIP'
    ];

    public function toResponseArray()
    {
        $aResponse = parent::toResponseArray();
        $aResponse['Authenticated'] = false;
        if (\Aurora\Api::GetSettings()->StoreAuthTokenInDB) {
            if (!empty($aResponse['AuthToken']) && !empty(\Aurora\System\Api::UserSession()->Get($aResponse['AuthToken']))) {
                $aResponse['Authenticated'] = true;
            }
        } elseif (!empty($aResponse['AuthToken'])) {
            $aResponse['Authenticated'] = true;
        }
        unset($aResponse['AuthToken']);
        return $aResponse;
    }
}
