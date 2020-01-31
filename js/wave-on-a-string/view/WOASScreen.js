// Copyright 2014-2020, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  const WOASView = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASView' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function WOASScreen( tandem ) {
    Screen.call( this,
      () => new WOASModel( 768, 504 ),
      model => new WOASView( model ), {
        backgroundColorProperty: new Property( '#FFFFB7' ),
        tandem: tandem
      }
    );
  }

  waveOnAString.register( 'WOASScreen', WOASScreen );

  return inherit( Screen, WOASScreen );
} );
