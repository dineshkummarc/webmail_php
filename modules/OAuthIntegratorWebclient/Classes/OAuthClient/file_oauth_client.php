<?php
/*
 * file_oauth_client.php
 *
 * @(#) $Id: file_oauth_client.php,v 1.3 2021/12/21 09:23:55 mlemos Exp $
 *
 */

class file_oauth_client_class extends oauth_client_class
{
    public $opened_file = false;
    /*
        var $user = 0;
    */
    public $session_cookie = 'oauth_session';
    public $session_path = '/';
    public $sessions = array();

    public function Initialize()
    {
        if (!isset($this->file)
        || !isset($this->file['name'])) {
            return $this->SetError('it was not specified a valid token storage file name');
        }
        if (!parent::Initialize()) {
            return false;
        }
        return true;
    }

    public function Finalize($success)
    {
        if ($this->opened_file) {
            fclose($this->opened_file);
            $this->opened_file = false;
        }
        return parent::Finalize($success);
    }

    public function GetStoredState(&$state)
    {
        if (!$this->SetupSession($session)) {
            return false;
        }
        $state = $session->state;
        return true;
    }

    public function SaveSession($session)
    {
        $name = $this->file['name'];
        if (!$this->opened_file) {
            if (!($this->opened_file = fopen($name, 'c+'))) {
                return $this->SetPHPError('could not open the token file '.$name);
            }
        }
        if (!flock($this->opened_file, LOCK_EX)) {
            return $this->SetPHPError('could not lock the token file '.$name.' for writing');
        }
        if (fseek($this->opened_file, 0)) {
            return $this->SetPHPError('could not rewind the token file '.$name.' for writing');
        }
        if (!ftruncate($this->opened_file, 0)) {
            return $this->SetPHPError('could not truncate the token file '.$name.' for writing');
        }
        if (!fwrite($this->opened_file, json_encode($session))) {
            return $this->SetPHPError('could not write to the token file '.$name);
        }
        if (!fclose($this->opened_file)) {
            return $this->SetPHPError('could not close to the token file '.$name);
        }
        $this->opened_file = false;
        return true;
    }

    public function ReadSession(&$session)
    {
        $session = null;
        $name = $this->file['name'];
        if (!file_exists($name)) {
            return true;
        }
        if (!($this->opened_file = fopen($name, 'c+'))) {
            return $this->SetPHPError('could not open the token file '.$name);
        }
        if (!flock($this->opened_file, LOCK_SH)) {
            return $this->SetPHPError('could not lock the token file '.$name.' for reading');
        }
        $json = '';
        while (!feof($this->opened_file)) {
            $data = fread($this->opened_file, 1000);
            if (!$data
            && !feof($this->opened_file)) {
                $this->SetError('could not read the token file'.$name);
                fclose($this->opened_file);
                $this->opened_file = false;
                return false;
            }
            $json .= $data;
        }
        flock($this->opened_file, LOCK_UN);
        $session = json_decode($json);
        if (!isset($session)) {
            return $this->SetPHPError('It was not possible to decode the OAuth token file '.$name, $php_errormsg);
        }
        if (GetType($session) !== 'object') {
            return $this->SetError('It was not possible to decode the OAuth token file '.$name.' because it seems corrupted');
        }
        return true;
    }

    public function CreateOAuthSession($user, &$session)
    {
        $this->InitializeOAuthSession($session);
        return $this->SaveSession($session);
    }

    public function SetOAuthSession(&$oauth_session, $session)
    {
        $oauth_session = new oauth_session_value_class();
        $oauth_session->id = $session->id;
        $oauth_session->session = $session->session;
        $oauth_session->state = $session->state;
        $oauth_session->access_token = $session->access_token;
        $oauth_session->access_token_secret = $session->access_token_secret;
        $oauth_session->expiry = $session->expiry;
        $oauth_session->authorized = $session->authorized;
        $oauth_session->type = $session->type;
        $oauth_session->server = $session->server;
        $oauth_session->creation = $session->creation;
        $oauth_session->refresh_token = $session->refresh_token;
        $oauth_session->access_token_response = (isset($session->access_token_response) ? $session->access_token_response : null);
    }

    public function GetOAuthSession($session_id, $server, &$oauth_session)
    {
        if (isset($this->sessions[$session_id][$server])) {
            $oauth_session = $this->sessions[$session_id][$server];
            return true;
        }
        if (!$this->ReadSession($session)) {
            return false;
        }
        if (!isset($session)) {
            $oauth_session = null;
            return true;
        }
        $this->SetOAuthSession($oauth_session, $session);
        $this->sessions[$session_id][$server] = $oauth_session;
        return true;
    }

    public function StoreAccessToken($access_token)
    {
        if (!$this->SetupSession($session)) {
            return false;
        }
        $session->access_token = $access_token['value'];
        $session->access_token_secret = (isset($access_token['secret']) ? $access_token['secret'] : '');
        $session->authorized = (isset($access_token['authorized']) ? $access_token['authorized'] : null);
        $session->expiry = (isset($access_token['expiry']) ? $access_token['expiry'] : null);
        if (isset($access_token['type'])) {
            $session->type = $access_token['type'];
        }
        $session->refresh_token = (isset($access_token['refresh']) ? $access_token['refresh'] : '');
        $session->access_token_response = (isset($access_token['response']) ? $access_token['response'] : null);
        if (!$this->GetOAuthSession($session->session, $this->server, $oauth_session)) {
            return($this->SetError('OAuth session error: '.$this->error));
        }
        if (!isset($oauth_session)) {
            $this->error = 'the session to store the access token was not found';
            return false;
        }
        $oauth_session->access_token = $session->access_token;
        $oauth_session->access_token_secret = $session->access_token_secret;
        $oauth_session->authorized = (isset($session->authorized) ? $session->authorized : null);
        $oauth_session->expiry = (isset($session->expiry) ? $session->expiry : null);
        $oauth_session->type = (isset($session->type) ? $session->type : '');
        $oauth_session->refresh_token = $session->refresh_token;
        $oauth_session->access_token_response = (isset($session->access_token_response) ? $session->access_token_response : null);
        return $this->SaveSession($oauth_session);
    }

    public function GetAccessToken(&$access_token)
    {
        if (!$this->ReadSession($session)) {
            return false;
        }
        if (isset($session)
        && strlen($session->access_token)) {
            $access_token = array(
                'value'=>$session->access_token,
                'secret'=>$session->access_token_secret
            );
            if (isset($session->authorized)) {
                $access_token['authorized'] = $session->authorized;
            }
            if (isset($session->expiry)) {
                $access_token['expiry'] = $session->expiry;
            }
            if (strlen($session->type)) {
                $access_token['type'] = $session->type;
            }
            if (strlen($session->refresh_token)) {
                $access_token['refresh'] = $session->refresh_token;
            }
            if (isset($session->access_token_response)) {
                $access_token['response'] = $session->access_token_response;
            }
        } else {
            $access_token = array();
        }
        return true;
    }

    public function ResetAccessToken()
    {
        if ($this->opened_file) {
            fclose($this->opened_file);
            $this->opened_file = false;
        }
        $name = $this->file['name'];
        if (!file_exists($name)) {
            return true;
        }
        if ($this->debug) {
            $this->OutputDebug('Resetting the access token status for OAuth server by removing the token file '.$name);
        }
        return unlink($name);
    }
};
