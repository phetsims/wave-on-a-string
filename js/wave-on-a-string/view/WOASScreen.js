// Copyright 2014-2015, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  var WOASView = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASView' );

  // strings
  var waveOnAStringTitleString = require( 'string!WAVE_ON_A_STRING/wave-on-a-string.title' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function WOASScreen( tandem ) {
    Screen.call( this, waveOnAStringTitleString, null, /* single-screen sim, no icon */
      function() { return new WOASModel( 768, 504 ); },
      function( model ) { return new WOASView( model ); }, {
        backgroundColor: '#FFFFB7',
        tandem: tandem
      }
    );
  }

  return inherit( Screen, WOASScreen );
} );
