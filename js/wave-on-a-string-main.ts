// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import WOASScreen from './wave-on-a-string/view/WOASScreen.js';
import WaveOnAStringStrings from './WaveOnAStringStrings.js';

const waveOnAStringTitleStringProperty = WaveOnAStringStrings[ 'wave-on-a-string' ].titleStringProperty;

simLauncher.launch( () => {
  //Create and start the sim
  new Sim( waveOnAStringTitleStringProperty, [
    new WOASScreen( Tandem.ROOT.createTandem( 'waveOnAStringScreen' ) )
  ], {
    credits: {
      leadDesign: 'Michael Dubson, Ariel Paul',
      softwareDevelopment: 'Jonathan Olson, Michael Dubson',
      team: 'Trish Loeblein, Ariel Paul, Kathy Perkins, Amy Rouinfar',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
              'to convert this simulation to HTML5.'
    }
  } ).start();
} );