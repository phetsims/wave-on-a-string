// Copyright 2014-2020, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( require => {
  'use strict';

  // modules
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  const WOASScreenView = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASScreenView' );

  class WOASScreen extends Screen {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {
      super(
        () => new WOASModel( tandem.createTandem( 'model' ) ),
        model => new WOASScreenView( model, tandem.createTandem( 'view' ) ), {
          backgroundColorProperty: new Property( '#FFFFB7' )
      } );
    }
  }

  return waveOnAString.register( 'WOASScreen', WOASScreen );
} );
