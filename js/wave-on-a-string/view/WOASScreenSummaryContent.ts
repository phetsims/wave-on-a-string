// Copyright 2025, University of Colorado Boulder

/**
 * Screen summary content for the simulation
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import WOASModel from '../model/WOASModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { WOASMode } from '../model/WOASMode.js';

const MODE_MAP = new Map<WOASMode, 'manual' | 'oscillate' | 'pulse'>( [
  [ WOASMode.MANUAL, 'manual' ],
  [ WOASMode.OSCILLATE, 'oscillate' ],
  [ WOASMode.PULSE, 'pulse' ]
] );

export default class WOASScreenSummaryContent extends ScreenSummaryContent {

  /**
   * @param model - This class is responsible for describing the entire model so it takes the entire model and is coupled to it.
   */
  public constructor( model: WOASModel ) {
    const modeStringProperty = new DerivedProperty( [ model.waveModeProperty ], mode => MODE_MAP.get( mode )! );

    super( {
      playAreaContent: WaveOnAStringFluent.a11y.screenSummary.playAreaStringProperty,
      interactionHintContent: WaveOnAStringFluent.a11y.screenSummary.interactionHint.createProperty( {
        mode: modeStringProperty
      } )
    } );
  }
}

waveOnAString.register( 'WOASScreenSummaryContent', WOASScreenSummaryContent );