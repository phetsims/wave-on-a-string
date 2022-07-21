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
import waveOnAStringStrings from './waveOnAStringStrings.js';

const waveOnAStringTitleString = waveOnAStringStrings[ 'wave-on-a-string' ].title;

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

simLauncher.launch( () => {
  //Create and start the sim
  new Sim( waveOnAStringTitleString, [
    new WOASScreen( Tandem.ROOT.createTandem( 'waveOnAStringScreen' ) )
  ], simOptions ).start();
} );