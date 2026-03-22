<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\MailTnefWebclientPlugin;

/**
 * Adds Expand button on TNEF-attachment and shows its content.
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
    /*
     * @var $oApiFileCache \Aurora\System\Managers\Filecache
     */
    public $oApiFileCache = null;

    public function init()
    {
        $this->oApiFileCache = new \Aurora\System\Managers\Filecache();
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

    public function ExpandFile($UserId, $Hash)
    {
        $mResult = array();

        $sUUID = \Aurora\System\Api::getUserUUIDById($UserId);
        $aValues = \Aurora\System\Api::DecodeKeyValues($Hash);
        $oMailDecorator = \Aurora\Modules\Mail\Module::Decorator();
        $aFiles = $oMailDecorator->SaveAttachmentsAsTempFiles($aValues['AccountID'], [$Hash]);
        foreach ($aFiles as $sTempName => $sHash) {
            if ($sHash === $Hash) {
                $rResource = $this->oApiFileCache->getFile($sUUID, $sTempName);
                $mResult = $this->expandTnefAttachment($sUUID, $rResource);
            }
        }

        return $mResult;
    }

    private function expandTnefAttachment($sUUID, $rResource)
    {
        $mResult = array();

        $attachment = new \TNEFDecoder\TNEFAttachment();
        if ($rResource) {
            $attachment->decodeTnef(\stream_get_contents($rResource));
            $files = $attachment->getFiles();

            foreach ($files as $file) {
                $sFileName = $file->getName();

                $sFileNameEncoding = mb_detect_encoding($sFileName, array("UTF-8", "SJIS"));
                if ($sFileNameEncoding != "UTF-8") {
                    $sFileName = mb_convert_encoding($sFileName, "UTF-8", $sFileNameEncoding);
                }

                $sTempName = md5(\microtime(true) . rand(1000, 9999));
                $rItemStream = fopen('php://memory', 'r+');
                fwrite($rItemStream, $file->getContent());
                rewind($rItemStream);

                if ($this->oApiFileCache->putFile($sUUID, $sTempName, $rItemStream, '', self::GetName())) {
                    $sFileName = str_replace("\0", '', $sFileName);
                    $mResult[] = \Aurora\System\Utils::GetClientFileResponse(
                        self::GetName(),
                        \Aurora\System\Api::getAuthenticatedUserId(),
                        $sFileName,
                        $sTempName,
                        strlen($file->getSize())
                    );
                }
            }
        }

        return $mResult;
    }
}
