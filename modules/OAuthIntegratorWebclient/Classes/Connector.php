<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\OAuthIntegratorWebclient\Classes;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2023, Afterlogic Corp.
 */
class Connector
{
    protected $Name = 'connector';
    public static $Debug = true;
    public static $Scopes = array();

    public $oModule = null;

    public function __construct($oModule)
    {
        $this->oModule = $oModule;
    }

    public function GetRedirectUrl()
    {
        return rtrim(\MailSo\Base\Http::SingletonInstance()->GetFullUrl(), '\\/ ') . '/?oauth=' . $this->Name;
    }

    public function Init($sId, $sSecret, $sScope = '') {}

    /**
     * @return \oauth_client_class
     */
    public function CreateClient($sId, $sSecret, $sScopes)
    {
        return null;
    }

    public function GetAccessToken($Id, $sSecret)
    {
        $mAccessToken = false;

        $aResult = $this->Init($Id, $sSecret);
        if (isset($aResult['access_token'])) {
            $mAccessToken = $aResult['access_token'];
        }

        return $mAccessToken;
    }

    public function RevokeAccessToken($Id, $sSecret, $sAccessToken = "")
    {
        $oClient = $this->CreateClient($Id, $sSecret, "");
        if ($oClient) {
            if (($bSuccess = $oClient->Initialize())) {
                if ($bSuccess = $oClient->CheckAccessToken($sRedirectUrl)) {
                    if (!isset($sRedirectUrl)) {
                        if (!empty($sAccessToken)) {
                            $oClient->access_token = $sAccessToken;
                        }
                        $bSuccess = $oClient->RevokeToken();
                    }
                }
                $bSuccess = $oClient->Finalize($bSuccess);
            }
        }
    }

    public function ResetAccessToken($Id, $sSecret)
    {
        $oClient = $this->CreateClient($Id, $sSecret, "");
        if ($oClient) {
            if (($bSuccess = $oClient->Initialize())) {
                $oClient->ResetAccessToken();
            }
        }
    }

    public function RefreshAccessToken($Id, $sSecret, $RefreshToken)
    {
        $aResult = false;
        $oClient = $this->CreateClient($Id, $sSecret, "");
        if ($oClient && $oClient->Initialize()) {
            $values = [
                'refresh_token' => $RefreshToken,
                'grant_type' => 'refresh_token',
                'client_id' => $oClient->client_id,
                'client_secret' => $oClient->client_secret
            ];

            $options = [
                'Resource' => 'OAuth refresh token',
                'ConvertObjects' => true
            ];

            $access_token_url = '';
            if (!$oClient->GetAccessTokenURL($access_token_url)) {
                return false;
            }
            if (strlen($oClient->access_token_content_type)) {
                $options['ResponseContentType'] = $oClient->access_token_content_type;
            }
            $response = [];
            if (!$oClient->SendAPIRequest($access_token_url, 'POST', $values, null, $options, $response)) {
                return false;
            }

            $aResult = $response;

            if (isset($aResult['error'])) {
                throw new \Aurora\System\Exceptions\ApiException(0, null, 'An error occurred while refreshing the access token: ' . $aResult['error']);
            }
        }

        return $aResult;
    }
}
