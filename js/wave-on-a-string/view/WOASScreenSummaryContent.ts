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
import { WOASEndType } from '../model/WOASEndType.js';

export default class WOASScreenSummaryContent extends ScreenSummaryContent {

  /**
   * @param model - This class is responsible for describing the entire model so it takes the entire model and is coupled to it.
   */
  public constructor( model: WOASModel ) {
    super( {
      playAreaContent: WaveOnAStringFluent.a11y.screenSummary.playAreaStringProperty,
      currentDetailsContent: [
        WaveOnAStringFluent.a11y.screenSummary.currentDetails.start.createProperty( {
          isPlaying: new DerivedProperty( [ model.isPlayingProperty ], isPlaying => isPlaying ? 'true' : 'false' ),
          wrenchPosition: new DerivedProperty( [ model.leftMostBeadYProperty ], y => y > 0.5 ? 'top' : y < -0.5 ? 'bottom' : 'middle' )
        } ),
        WaveOnAStringFluent.a11y.screenSummary.currentDetails.end.createProperty( {
          endPosition: new DerivedProperty( [ model.endTypeProperty ], endType => {
            return {
              [ WOASEndType.FIXED_END.toString() ]: 'fixed',
              [ WOASEndType.LOOSE_END.toString() ]: 'loose',
              [ WOASEndType.NO_END.toString() ]: 'no'
            }[ endType.toString() ] as 'fixed' | 'loose' | 'no';
          } )
        } )
      ],
      interactionHintContent: WaveOnAStringFluent.a11y.screenSummary.interactionHintStringProperty
    } );
  }
}

waveOnAString.register( 'WOASScreenSummaryContent', WOASScreenSummaryContent );