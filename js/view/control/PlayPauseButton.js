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
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function PlayPauseButton( model, options ) {
    Node.call( this );
    var stepButton, playPauseButton;

    this.addChild( playPauseButton = new ToggleButton(
      new Image( require( 'image!WOAS/button_sim_pause.png' ) ),
      new Image( require( 'image!WOAS/button_sim_play.png' ) ),
      model.playProperty,
      {scale: 0.7} ) );
    playPauseButton.touchArea = Shape.bounds( Bounds2.rect(11,11,playPauseButton.width,playPauseButton.height).dilated( 10) );
    playPauseButton.mouseArea = Shape.bounds( Bounds2.rect(11,11,playPauseButton.width,playPauseButton.height) );
    this.addChild( stepButton = new PushButton(
      new Image( require( 'image!WOAS/button_step_unpressed.png' ) ),
      new Image( require( 'image!WOAS/button_step_hover.png' ) ),
      new Image( require( 'image!WOAS/button_step_pressed.png' ) ),
      new Image( require( 'image!WOAS/button_step_deactivated.png' ) ),
      {scale: 0.7, x: 60, y: 7, listener: model.manualStep.bind( model )} ) );
    stepButton.enabled = false;
    stepButton.touchArea = Shape.bounds( Bounds2.rect(8,8,stepButton.width,stepButton.height).dilated( 15) );
    stepButton.mouseArea = Shape.bounds( Bounds2.rect(8,8,stepButton.width,stepButton.height) );
    this.mutate( options );
    model.playProperty.link( function updatePlayPauseButton( value ) {
      stepButton.enabled = !value;
    } );
  }

  inherit( Node, PlayPauseButton );

  return PlayPauseButton;
} );
