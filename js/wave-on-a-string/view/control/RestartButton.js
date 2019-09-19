// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control Restart button view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // strings
  const restartString = require( 'string!WAVE_ON_A_STRING/restart' );

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
