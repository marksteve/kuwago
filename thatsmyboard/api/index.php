<?php
include_once '../epiphany/src/Epi.php';
Epi::setPath('base', '../epiphany/src');
Epi::init('api');

// The API class
include_once 'class.board_api.php';

getApi()->get('/version.json', array('BoardApi', 'version'), EpiApi::external);
getApi()->get('/locations.json', array('BoardApi', 'locations'), EpiApi::external);
getApi()->get('/([^/]+)/slope.json', array('BoardApi', 'slope'), EpiApi::external);
getApi()->get('/([^/]+)/rainfall.json', array('BoardApi', 'rainfall'), EpiApi::external);

getRoute()->run();

