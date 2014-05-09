<?php
/**
 *  API class for Moom Manes' That's My Board
 *  Contains dummy stuff only
 */
class BoardApi {
  public static function version() {
    return '1.0';
  }

  public function locations() {
    return array (
        array(
        array('name' => 'Tublay'),
        array('x' => '16.522999'),
        array('y' => '120.61747')
      ),
      array(
        array('name' => 'Rizal'),
        array('x' => '14.112104'),
        array('y' => '121.394779')
      ),
      array(
        array('name' => 'Amulung'),
        array('x' => '17.846754'),
        array('y' => '121.729782')
      ),
    )
  }

  public function landslide() {
    return array(
      array('threshold' => 'Marikina'),
      array('x' => '14.657582'),
      array('y' => '121.063314'),
      array('status' => '14.657582')
    );
  }

  public function rainfall() {
    return "RAIN";
  }
}