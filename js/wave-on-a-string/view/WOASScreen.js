// Copyright 2014-2015, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var Screen = require( 'JOIST/Screen' );
  var WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  var WOASView = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASView' );
  var Property = require( 'AXON/Property' );

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
