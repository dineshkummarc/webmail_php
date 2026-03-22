<?php
  include_once '../system/autoload.php';
  
  use Aurora\System\Api;
  use Aurora\System\Application;
  
  if (is_array($_GET) && count($_GET) > 0) {
  	Api::Init();
  	Application::setBaseUrl(\substr(Application::getBaseUrl(), 0, -strlen(basename(__DIR__))-1));
  	Application::Start();
  } else {
  	include_once './main.html';
  }
