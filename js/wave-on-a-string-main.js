// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const WOASScreen = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASScreen' );

  // strings
  const waveOnAStringTitleString = require( 'string!WAVE_ON_A_STRING/wave-on-a-string.title' );

  const simOptions = {
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
      new WOASScreen( Tandem.rootTandem.createTandem( 'waveOnAStringScreen' ) )
    ], simOptions ).start();
  } );
} );
