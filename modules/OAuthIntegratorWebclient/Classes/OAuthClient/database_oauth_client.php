<?php
/*
 * database_oauth_client.php
 *
 * @(#) $Id: database_oauth_client.php,v 1.11 2022/05/28 09:18:30 mlemos Exp $
 *
 */

class database_oauth_client_class extends oauth_client_class
{
    public $service;
    public $session = '';
    public $user = 0;
    public $session_cookie = 'oauth_session';
    public $session_path = '/';
    public $sessions = array();
    public $oauth_session_table = 'oauth_session';
    public $oauth_state_field = 'state';
    public $oauth_access_token_field = 'access_token';
    public $oauth_access_token_secret_field = 'access_token_secret';
    public $oauth_expiry_field = 'expiry';
    public $oauth_authorized_field = 'authorized';
    public $oauth_type_field = 'type';
    public $oauth_server_field = 'server';
    public $oauth_creation_field = 'creation';
    public $oauth_refresh_token_field = 'refresh_token';
    public $oauth_access_token_response_field = 'access_token_response';
    public $oauth_id_field = 'id';
    public $oauth_user_field = 'user';

    public function Query($sql, $parameters, &$results, $result_types = null)
    {
        return $this->SetError('Database Query is not implemented');
    }

    public function GetStoredState(&$state)
    {
        if (!$this->SetupSession($session)) {
            return false;
        }
        $state = $session->state;
        return true;
    }

    public function CreateOAuthSession($user, &$session)
    {
        $this->InitializeOAuthSession($session);
        $parameters = array(
            's', $session->session,
            's', $session->state,
            's', $session->access_token,
            's', $session->access_token_secret,
            's', $session->expiry,
            'b', $session->authorized,
            's', $session->type,
            's', $session->server,
            'ts', $session->creation,
            's', $session->refresh_token,
            's', $session->access_token_response
        );
        if (!$this->Query('INSERT INTO '.$this->oauth_session_table.' (session, '.$this->oauth_state_field.', '.$this->oauth_access_token_field.', '.$this->oauth_access_token_secret_field.', '.$this->oauth_expiry_field.', '.$this->oauth_authorized_field.', '.$this->oauth_type_field.', '.$this->oauth_server_field.', '.$this->oauth_creation_field.', '.$this->oauth_refresh_token_field.', '.$this->oauth_access_token_response_field.') VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', $parameters, $results)) {
            return false;
        }
        $session->id = $results['insert_id'];
        return true;
    }

    public function SetOAuthSession(&$oauth_session, $session)
    {
        $oauth_session = new oauth_session_value_class();
        $oauth_session->id = $session[0];
        $oauth_session->session = $session[1];
        $oauth_session->state = $session[2];
        $oauth_session->access_token = $session[3];
        $oauth_session->access_token_secret = $session[4];
        $oauth_session->expiry = $session[5];
        $oauth_session->authorized = $session[6];
        $oauth_session->type = $session[7];
        $oauth_session->server = $session[8];
        $oauth_session->creation = $session[9];
        $oauth_session->refresh_token = $session[10];
        $oauth_session->access_token_response = (isset($session[11]) ? json_decode($session[11], true) : null);
    }

    public function GetUserSession($user, &$oauth_session)
    {
        if ($this->debug) {
            $this->OutputDebug('Getting the OAuth session for user '.$user);
        }
        $parameters = array(
            'i', $user,
            's', $this->server
        );
        $result_types = array(   'i','s',     's',   's',          's',                 'ts',   'b',        's',  's',    'ts',     's',           's');
        if (!$this->Query('SELECT '.$this->oauth_id_field.', session, '.$this->oauth_state_field.', '.$this->oauth_access_token_field.', '.$this->oauth_access_token_secret_field.', '.$this->oauth_expiry_field.', '.$this->oauth_authorized_field.', '.$this->oauth_type_field.', '.$this->oauth_server_field.', '.$this->oauth_creation_field.', '.$this->oauth_refresh_token_field.', '.$this->oauth_access_token_response_field.' FROM '.$this->oauth_session_table.' WHERE '.$this->oauth_user_field.'=? AND '.$this->oauth_server_field.'=?', $parameters, $results, $result_types)) {
            return false;
        }
        if (count($results['rows']) === 0) {
            $oauth_session = null;
            return true;
        }
        $this->SetOAuthSession($oauth_session, $results['rows'][0]);
        $this->sessions[$oauth_session->session][$this->server] = $oauth_session;
        $this->session = $oauth_session->session;
        return true;
    }

    public function GetOAuthSession($session, $server, &$oauth_session)
    {
        if (isset($this->sessions[$session][$server])) {
            $oauth_session = $this->sessions[$session][$server];
            return true;
        }
        $parameters = array(
            's', $session,
            's', $server
        );
        $result_types = array(   'i','s',     's',   's',          's',                 'ts',   'b',        's',  's',    'ts',     's',           's');
        if (!$this->Query('SELECT '.$this->oauth_id_field.', session, '.$this->oauth_state_field.', '.$this->oauth_access_token_field.', '.$this->oauth_access_token_secret_field.', '.$this->oauth_expiry_field.', '.$this->oauth_authorized_field.', '.$this->oauth_type_field.', '.$this->oauth_server_field.', '.$this->oauth_creation_field.', '.$this->oauth_refresh_token_field.', '.$this->oauth_access_token_response_field.' FROM '.$this->oauth_session_table.' WHERE session=? AND '.$this->oauth_server_field.'=?', $parameters, $results, $result_types)) {
            return false;
        }
        if (count($results['rows']) === 0) {
            $oauth_session = null;
            return true;
        }
        $this->SetOAuthSession($oauth_session, $results['rows'][0]);
        $this->sessions[$session][$server] = $oauth_session;
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
        $parameters = array(
            's', $oauth_session->session,
            's', $oauth_session->state,
            's', $oauth_session->access_token,
            's', $oauth_session->access_token_secret,
            's', $oauth_session->expiry,
            'b', $oauth_session->authorized,
            's', $oauth_session->type,
            's', $oauth_session->server,
            'ts', $oauth_session->creation,
            's', $oauth_session->refresh_token,
            's', json_encode($oauth_session->access_token_response),
            'i', $this->user,
            'i', $oauth_session->id
        );
        return $this->Query('UPDATE '.$this->oauth_session_table.' SET session=?, '.$this->oauth_state_field.'=?, '.$this->oauth_access_token_field.'=?, '.$this->oauth_access_token_secret_field.'=?, '.$this->oauth_expiry_field.'=?, '.$this->oauth_authorized_field.'=?, '.$this->oauth_type_field.'=?, '.$this->oauth_server_field.'=?, '.$this->oauth_creation_field.'=?, '.$this->oauth_refresh_token_field.'=?, '.$this->oauth_access_token_response_field.'=?, '.$this->oauth_user_field.'=? WHERE '.$this->oauth_id_field.'=?', $parameters, $results);
    }

    public function GetAccessToken(&$access_token)
    {
        if ($this->user) {
            if (!$this->GetUserSession($this->user, $session)) {
                return false;
            }
            if (!isset($session)) {
                return $this->SetError('it was not found the OAuth session for user '.$this->user);
            }
        } else {
            if (!$this->SetupSession($session)) {
                return false;
            }
        }
        if (strlen($session->access_token)) {
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
        if ($this->debug) {
            $this->OutputDebug('Resetting the access token status for OAuth server located at '.$this->access_token_url);
        }
        SetCookie($this->session_cookie, '', 0, $this->session_path);
        return true;
    }

    public function SetUser($user)
    {
        if (strlen($this->session) === 0) {
            $this->SetError('it was not yet established an OAuth session');
        }
        $parameters = array(
            'i', $user,
            's', $this->session,
            's', $this->server,
        );
        if (!$this->Query('UPDATE '.$this->oauth_session_table.' SET '.$this->oauth_user_field.'=? WHERE session=? AND '.$this->oauth_server_field.'=?', $parameters, $results)) {
            return false;
        }
        $this->user = $user;
        return true;
    }
};
