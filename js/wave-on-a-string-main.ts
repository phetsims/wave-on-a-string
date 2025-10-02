// Copyright 2013-2025, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import WOASScreen from './wave-on-a-string/view/WOASScreen.js';
import WaveOnAStringFluent from './WaveOnAStringFluent.js';

const waveOnAStringTitleStringProperty = WaveOnAStringFluent[ 'wave-on-a-string' ].titleStringProperty;

simLauncher.launch( () => {
  //Create and start the sim
  new Sim( waveOnAStringTitleStringProperty, [
    new WOASScreen( Tandem.ROOT.createTandem( 'waveOnAStringScreen' ) )
  ], {
    credits: {
      leadDesign: 'Michael Dubson, Ariel Paul, Brett Fiedler',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
              'to convert this simulation to HTML5.'
    }
  } ).start();
} );