<?php
/*
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\RecaptchaWebclientPlugin\Enums;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 */
class RequestMethods extends \Aurora\System\Enums\AbstractEnumeration
{
    public const CurlPost		= 'curlpost';
    public const Post			= 'post';
    public const SocketPost	= 'socketpost';

    /**
     * @var array
     */
    protected $aConsts = array(
        'CurlPost' => self::CurlPost,
        'Post' => self::Post,
        'SocketPost' => self::SocketPost
    );
}
