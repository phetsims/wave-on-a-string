// Copyright 2002-2013, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 */
define( function( require ) {
  'use strict';

  // modules
  var WOASModel = require( 'WOAS/model/WOASModel' );
  var WOASView = require( 'WOAS/view/WOASView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var simTitleString = require( 'string!WOAS/simTitle' );

  function WOASScreen() {

    Screen.call( this, simTitleString, null, /* single-screen sim, no icon */
      function() { return new WOASModel( 768, 504 ); },
      function( model ) { return new WOASView( model ); },
      { backgroundColor: '#FFFFB7' }
    );
  }

  return inherit( Screen, WOASScreen );
} );
