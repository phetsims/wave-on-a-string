// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );
  var WOASScreen = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASScreen' );

  // strings
  var waveOnAStringTitleString = require( 'string!WAVE_ON_A_STRING/wave-on-a-string.title' );

  // constants
  var tandem = Tandem.rootTandem;

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Ariel Paul',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
              'to convert this simulation to HTML5.'
    }
  };

  SimLauncher.launch( function() {
    //Create and start the sim
    new Sim( waveOnAStringTitleString, [
      new WOASScreen( tandem.createTandem( 'waveOnAStringScreen' ) )
    ], simOptions ).start();
  } );
} );
