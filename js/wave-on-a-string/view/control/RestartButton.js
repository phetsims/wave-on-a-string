// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control Restart button view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // strings
  var restartString = require( 'string!WAVE_ON_A_STRING/restart' );

  function RestartButton( model, options ) {
    TextPushButton.call( this, restartString, {
      listener: model.manualRestart.bind( model ),
      font: new PhetFont( 12 ),
      baseColor: 'hsl(210,0%,85%)',
      maxWidth: 250
    } );
    this.mutate( options );
    this.touchArea = this.localBounds.dilatedXY( 5, 20 );
  }

  waveOnAString.register( 'RestartButton', RestartButton );

  inherit( TextPushButton, RestartButton );

  return RestartButton;
} );
