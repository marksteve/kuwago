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
        'name' => 'Tublay',
        'x' => '16.522999',
        'y' => '120.61747'
      ),
      array(
        'name' => 'Rizal',
        'x' => '14.112104',
        'y' => '121.394779'
      ),
      array(
        'name' => 'Amulung',
        'x' => '17.846754',
        'y' => '121.729782'
      )
    );
  }

  public function slope($location) {
    return array(
      array(
        'threshold' => 'Marikina',
        'x' => '14.657582',
        'y' => '121.063314',
        'status' => '14.657582'
      )
    );
  }

  public function rainfall($location) {
    return array(
      array(
        'threshold' => 'Marikina',
        'x' => '14.657582',
        'y' => '121.063314',
        'status' => '14.657582'
      )
    );
  }
}
