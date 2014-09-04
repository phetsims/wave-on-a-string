// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( [
  'JOIST/SimLauncher', 'JOIST/Sim', 'JOIST/Screen', 'string!WOAS/simTitle',
  'SCENERY/nodes/Rectangle',
  'WOAS/view/WOASScreen'], function( SimLauncher, Sim, Screen, simTitleString, Rectangle, WOASScreen ) {
  'use strict';

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Ariel Paul',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      designTeam: 'Michael Dubson, Ariel Paul, Trish Loeblein, Kathy Perkins, Amy Rouinfar',
      interviews: 'Amy Rouinfar',
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
