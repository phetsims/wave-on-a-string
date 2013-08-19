// Copyright 2002-2013, University of Colorado Boulder

/**
 * Images loader for this simulation.
 *
 * This object will be extended lazily after the image loader completes.
 * Makes it possible to load through the module system rather having to
 * pass as a parameter everywhere or resort to using a global.
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( function() {
  "use strict";
  return {
    imageNames: [
      'button_pulse_hover.png',
      'button_pulse_pressed.png',
      'button_pulse_unpressed.png',
      'button_restart_hover.png',
      'button_restart_pressed.png',
      'button_restart_unpressed.png',
      'button_sim_pause.png',
      'button_sim_pause_hover.png',
      'button_sim_play.png',
      'button_sim_play_hover.png',
      'button_step_deactivated.png',
      'button_step_hover.png',
      'button_step_pressed.png',
      'button_step_unpressed.png',
      'button_timer_pause_hover.png',
      'button_timer_pause_pressed.png',
      'button_timer_pause_unpressed.png',
      'button_timer_reset_hover.png',
      'button_timer_reset_pressed.png',
      'button_timer_reset_unpressed.png',
      'clamp_2.png',
      'oscillator_post.png',
      'oscillator_wheel.png',
      'ring_back.png',
      'ring_front.png',
      'Ruler_two_side.png',
      'Ruler_two_side_5cm.png',
      'tweaker_left_disabled.png',
      'tweaker_left_hover.png',
      'tweaker_left_pressed.png',
      'tweaker_left_unpressed.png',
      'tweaker_right_disabled.png',
      'tweaker_right_hover.png',
      'tweaker_right_pressed.png',
      'tweaker_right_unpressed.png',
      'wrench_2.png',
      'slider.png',
      'reset_button_disabled.png',
      'reset_button_down.png',
      'reset_button_over.png',
      'reset_button_up.png',
      'window.png',
      'window_back.png',
      'window_edge.png',
      'button_timer_start_hover.png',
      'button_timer_start_pressed.png',
      'button_timer_start_unpressed.png'
    ]
  };
} );