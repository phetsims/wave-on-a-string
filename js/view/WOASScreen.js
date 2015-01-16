// Copyright 2002-2014, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var WOASModel = require( 'WAVE_ON_A_STRING/model/WOASModel' );
  var WOASView = require( 'WAVE_ON_A_STRING/view/WOASView' );

  // strings
  var simTitleString = require( 'string!WAVE_ON_A_STRING/simTitle' );

  function WOASScreen() {

    Screen.call( this, simTitleString, null, /* single-screen sim, no icon */
      function() { return new WOASModel( 768, 504 ); },
      function( model ) { return new WOASView( model ); },
      { backgroundColor: '#FFFFB7' }
    );
  }

  return inherit( Screen, WOASScreen );
} );
