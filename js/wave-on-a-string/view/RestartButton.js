// Copyright 2013-2020, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const TextPushButton = require( 'SUN/buttons/TextPushButton' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // strings
  const restartString = require( 'string!WAVE_ON_A_STRING/restart' );

  class RestartButton extends TextPushButton {
    /**
     * @param {function} callback
     * @param {Object} [options]
     */
    constructor( callback, options ) {
      super( restartString, {
        listener: callback,
        font: new PhetFont( 12 ),
        baseColor: 'hsl(210,0%,85%)',
        maxWidth: 250
      } );

      this.mutate( options );

      this.touchArea = this.localBounds.dilatedXY( 5, 20 );
    }
  }

  return waveOnAString.register( 'RestartButton', RestartButton );
} );
