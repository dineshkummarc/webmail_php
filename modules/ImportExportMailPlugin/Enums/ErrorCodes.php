<?php
/*
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\ImportExportMailPlugin\Enums;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 */
class ErrorCodes
{
    public const UnknownError	= 1001;
    public const ErrorSizeLimit	= 1002;
    public const ZipArchiveClassNotFound	= 1003;

    /**
     * @var array
     */
    protected $aConsts = [
        'UnknownError'	=> self::UnknownError,
        'ErrorSizeLimit'	=> self::ErrorSizeLimit,
        'ZipArchiveClassNotFound' => self::ZipArchiveClassNotFound
    ];
}
