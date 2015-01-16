// Copyright 2002-2014, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Sim = require( 'JOIST/Sim' );
  var Screen = require( 'JOIST/Screen' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var WOASScreen = require( 'WOAS/view/WOASScreen' );

  // strings
  var simTitleString = require( 'string!WOAS/simTitle' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Ariel Paul',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\n' +
              'to convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    //Create and start the sim
    new Sim( simTitleString, [
      new WOASScreen()
    ], simOptions ).start();
  } );
} );
