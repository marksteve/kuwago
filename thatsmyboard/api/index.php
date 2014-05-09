<?php
include_once '../epiphany/src/Epi.php';
Epi::setPath('base', '../epiphany/src');
Epi::init('api');

date_default_timezone_set('UTC');

// The API class
include_once 'class.board_api.php';

getApi()->get('/version.json', array('BoardApi', 'version'), EpiApi::external);
getApi()->get('/locations.json', array('BoardApi', 'locations'), EpiApi::external);

getRoute()->run();

