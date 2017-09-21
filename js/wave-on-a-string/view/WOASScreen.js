// Copyright 2014-2017, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  var WOASView = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASView' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function WOASScreen( tandem ) {
    Screen.call( this,
      function() { return new WOASModel( 768, 504 ); },
      function( model ) { return new WOASView( model ); }, {
        backgroundColorProperty: new Property( '#FFFFB7' ),
        tandem: tandem
      }
    );
  }

  waveOnAString.register( 'WOASScreen', WOASScreen );

  return inherit( Screen, WOASScreen );
} );
