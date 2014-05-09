<?php
/**
 *  API class for Moom Manes' That's My Board
 *  Contains dummy stuff only
 */


function generate_data($seed) {
  srand($seed);
  $rainfall = array();
  $slope = array();
  $rainfall_threshold = rand() * 0.00000001;
  $slope_threshold = rand() * 0.00000001;
  $base = time() - 30 * 24 * 60 * 60;
  for ($i = 0; $i < 20; $i++) {
    if (rand() * 0.0000000005 < 0.2) {
      $c = rand() * 0.00000001;
    } else {
      $c = 10;
    }
    $rainfall[] = array(
      'threshold' => $rainfall_threshold,
      'x' => $base - ($i * 129600),
      'y' => $c + rand() * 0.000000001,
    );
    $slope[] = array(
      'threshold' => $slope_threshold,
      'x' => $base - ($i * 129600),
      'y' => $c + rand() * 0.000000001,
    );
  }
  return array(
    'rainfall' => $rainfall,
    'slope' => $slope
  );
}


class BoardApi {
  public static function version() {
    return '1.0';
  }

  public function locations() {
    return array (
      array_merge(
        generate_data(9087312),
        array(
          'name' => 'Tublay',
          'x' => '16.522999',
          'y' => '120.61747',
        )
      ),
      array_merge(
        generate_data(90281372),
        array(
          'name' => 'Rizal',
          'x' => '14.112104',
          'y' => '121.394779',
        )
      ),
      array_merge(
        generate_data(32091831),
        array(
          'name' => 'Amulung',
          'x' => '17.846754',
          'y' => '121.729782',
        )
      )
    );
  }

}
