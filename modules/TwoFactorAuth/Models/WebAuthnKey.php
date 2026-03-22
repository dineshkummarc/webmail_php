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
 * Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey
 *
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 * @package Api
 * @property integer $Id
 * @property integer $UserId
 * @property string $Name
 * @property string $KeyData
 * @property integer $CreationDateTime
 * @property integer $LastUsageDateTime
 * @property \Illuminate\Support\Carbon|null $CreatedAt
 * @property \Illuminate\Support\Carbon|null $UpdatedAt
 * @property-read mixed $entity_id
 * @method static int count(string $columns = '*')
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey find(int|string $id, array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey findOrFail(int|string $id, mixed $id, Closure|array|string $columns = ['*'], Closure $callback = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey first(array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey firstWhere(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey query()
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey where(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereCreationDateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\TwoFactorAuth\Models\WebAuthnKey whereIn(string $column, mixed $values, string $boolean = 'and', bool $not = false)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereKeyData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereLastUsageDateTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WebAuthnKey whereUserId($value)
 * @mixin \Eloquent
 */
class WebAuthnKey extends Model
{
    protected $table = 'security_web_authn_keys';
    protected $foreignModel = User::class;
    protected $foreignModelIdColumn = 'UserId'; // Column that refers to an external table

    protected $fillable = [
                'Id',
                'UserId',
                'Name',
                'KeyData',
                'CreationDateTime',
                'LastUsageDateTime'
    ];
}
