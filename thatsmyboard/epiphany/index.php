<?php
chdir('..');
include_once '../epiphany/src/Epi.php';
Epi::setPath('base', '../src');
Epi::init('api');


Epi::init('api');
getApi()->get('/version.json', array('Api', 'version'), EpiApi::external);
getApi()->get('/users.json', array('Api', 'users'), EpiApi::external);
getRoute()->get('/users', array('Site', 'users'));
getRoute()->run();

class Api {
  public static function version() {
    return '1.0';
  }

  public static function users() {
    $users = array(
      array('username' => 'jmathai'),
      array('username' => 'stevejobs'),
      array('username' => 'billgates')
    );
    return $users;
  }
}

class Site {
  public static function users()
  {
    $users = getApi()->invoke('/users.json');
    echo '<ul>';
    foreach($users as $user) {
      echo "<li>{$user['username']}</li>"
    }
    echo '</ul>';
  }
}