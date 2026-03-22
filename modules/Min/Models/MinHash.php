<?php

namespace Aurora\Modules\Min\Models;

use Aurora\System\Classes\Model;
use Aurora\Modules\Core\Models\User;

/**
 * Aurora\Modules\Min\Models\MinHash
 *
 * @property integer $Id
 * @property string $HashId
 * @property integer|null $UserId
 * @property string $Hash
 * @property string $Data
 * @property integer|null $ExpireDate
 * @property \Illuminate\Support\Carbon|null $CreatedAt
 * @property \Illuminate\Support\Carbon|null $UpdatedAt
 * @property-read mixed $entity_id
 * @method static int count(string $columns = '*')
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash find(int|string $id, array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash findOrFail(int|string $id, mixed $id, Closure|array|string $columns = ['*'], Closure $callback = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash first(array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash firstWhere(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash query()
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash create(array $attributes)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash where(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash whereNotNull(string|array $columns, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereExpireDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereHashId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\Min\Models\MinHash whereIn(string $column, mixed $values, string $boolean = 'and', bool $not = false)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|MinHash whereUserId($value)
 * @mixin \Eloquent
 */
class MinHash extends Model
{
    protected $table = 'core_min_hashes';

    protected $foreignModel = User::class;
    protected $foreignModelIdColumn = 'UserId'; // Column that refers to an external table

    protected $fillable = [
        'Id',
        'HashId',
        'UserId',
        'Hash',
        'Data',
        'ExpireDate'
    ];
}
