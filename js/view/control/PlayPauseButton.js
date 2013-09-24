/**
 * Copyright 2002-2013, University of Colorado
 * Control Play/Pause and Step buttons view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButton = require( 'SUN/PushButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );

  function PlayPauseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var stepButton, playPauseButton;

    var step = function() {
      model.manualStep();
    };

    this.addChild( playPauseButton = new ToggleButton(
      new Image( require( 'image!WOAS/../images/button_sim_pause.png' ) ),
      new Image( require( 'image!WOAS/../images/button_sim_play.png' ) ),
      model.playProperty,
      {scale: 0.7} ) );

    this.addChild( stepButton = new PushButton(
      new Image( require( 'image!WOAS/../images/button_step_unpressed.png' ) ),
      new Image( require( 'image!WOAS/../images/button_step_hover.png' ) ),
      new Image( require( 'image!WOAS/../images/button_step_pressed.png' ) ),
      new Image( require( 'image!WOAS/../images/button_step_deactivated.png' ) ),
      step, {scale: 0.7, x: 50, y: 7} ) );
    stepButton.enabled = false;

    model.playProperty.link( function updatePlayPauseButton( value ) {
      stepButton.enabled = !value;
    } );
  }

  inherit( Node, PlayPauseButton );

  return PlayPauseButton;
} );