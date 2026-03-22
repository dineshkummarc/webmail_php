<?php

namespace Aurora\Modules\OAuthIntegratorWebclient\Models;

use Aurora\System\Classes\Model;
use Aurora\Modules\Core\Models\User;

/**
 * Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount
 *
 * @property integer $Id
 * @property integer $IdUser
 * @property string $IdSocial
 * @property string $Type
 * @property string $Name
 * @property string $Email
 * @property string $AccessToken
 * @property string|null $RefreshToken
 * @property string $Scopes
 * @property integer $Disabled
 * @property string $AccountType
 * @property \Illuminate\Support\Carbon|null $CreatedAt
 * @property \Illuminate\Support\Carbon|null $UpdatedAt
 * @property-read mixed $entity_id
 * @method static int count(string $columns = '*')
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount find(int|string $id, array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount findOrFail(int|string $id, mixed $id, Closure|array|string $columns = ['*'], Closure $callback = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount first(array|string $columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount firstWhere(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount where(Closure|string|array|\Illuminate\Database\Query\Expression $column, mixed $operator = null, mixed $value = null, string $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereAccessToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereAccountType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereDisabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereIdSocial($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereIdUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\Aurora\Modules\OAuthIntegratorWebclient\Models\OauthAccount whereIn(string $column, mixed $values, string $boolean = 'and', bool $not = false)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereRefreshToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereScopes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OauthAccount whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class OauthAccount extends Model
{
    protected $foreignModel = User::class;
    protected $foreignModelIdColumn = 'IdUser'; // Column that refers to an external table

    protected $fillable = [
        'Id',
        'IdUser',
        'IdSocial',
        'Type',
        'Name',
        'Email',
        'AccessToken',
        'RefreshToken',
        'Scopes',
        'Disabled',
        'AccountType'
    ];

    public function getScopesAsArray()
    {
        $aResult = array();
        if (!$this->Disabled) {
            $aResult = array_map(
                function ($sValue) {
                    if (!empty($sValue)) {
                        return strtolower($sValue);
                    }
                },
                explode(' ', $this->Scopes)
            );
        }

        return $aResult;
    }

    /**
     * @param string $sScope
     *
     * @return bool
     */
    public function issetScope($sScope)
    {
        return /*'' === $this->Scopes || */false !== strpos(strtolower($this->Scopes), strtolower($sScope));
    }

    /**
     * @param string $sScope
     */
    public function setScope($sScope)
    {
        $aScopes = $this->getScopesAsArray();
        if (!array_search($sScope, array_unique($aScopes))) {
            $aScopes[] = $sScope;
            $this->Scopes = implode(' ', array_unique($aScopes));
        }
    }

    /**
     * @param array $aScopes
     */
    public function setScopes($aScopes)
    {
        $this->Scopes = implode(' ', array_unique(array_merge($aScopes, $this->getScopesAsArray())));
    }

    /**
     * @param string $sScope
     */
    public function unsetScope($sScope)
    {
        $aScopes = array_map(
            function ($sValue) {
                return strtolower($sValue);
            },
            explode(' ', $this->Scopes)
        );
        $mResult = array_search($sScope, $aScopes);
        if ($mResult !== false) {
            unset($aScopes[$mResult]);
            $this->Scopes = implode(' ', $aScopes);
        }
    }
}
