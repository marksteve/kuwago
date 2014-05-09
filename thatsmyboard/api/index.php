<?php
include_once '../epiphany/src/Epi.php';
Epi::setPath('base', '../epiphany/src');
Epi::init('api');

// The API class
include_once 'class.board_api.php';

getApi()->get('/version.json', array('BoardApi', 'version'), EpiApi::external);
getApi()->get('/location.json', array('BoardApi', 'location'), EpiApi::external);

getApi()->get('/location/slide.json', array('BoardApi', 'slide'), EpiApi::external);

getRoute()->run();

