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
      currentDetailsContent: [
        WaveOnAStringFluent.a11y.screenSummary.currentDetails.start.createProperty( {
          isPlaying: new DerivedProperty( [ model.isPlayingProperty ], isPlaying => isPlaying ? 'true' : 'false' ),
          wrenchPosition: new DerivedProperty( [ model.leftMostBeadYProperty ], y => y > 0.5 ? 'top' : y < -0.5 ? 'bottom' : 'middle' ),
          mode: modeStringProperty,
          active: new DerivedProperty( [ model.waveModeProperty, model.isPulseActiveProperty ], ( mode, isPulseActive ) => {
            return ( mode !== WOASMode.PULSE || isPulseActive ) ? 'true' : 'false';
          } ),
          amplitude: new DerivedProperty( [ model.amplitudeProperty ], amplitude => {
            const magnitude = Math.abs( amplitude );
            if ( magnitude < 1e-3 ) {
              return 'zero';
            }
            else if ( magnitude < 0.4 ) {
              return 'low';
            }
            else if ( magnitude > 0.9 ) {
              return 'high';
            }
            else {
              return 'medium';
            }
          } ),
          frequency: new DerivedProperty( [ model.frequencyProperty ], frequency => {
            const magnitude = Math.abs( frequency );
            if ( magnitude < 1e-3 ) {
              return 'zero';
            }
            else if ( magnitude < 1 ) {
              return 'low';
            }
            else if ( magnitude > 2 ) {
              return 'high';
            }
            else {
              return 'medium';
            }
          } ),
          pulseWidth: new DerivedProperty( [ model.pulseWidthProperty ], pulseWidth => {
            if ( pulseWidth < 0.35 ) {
              return 'low';
            }
            else if ( pulseWidth > 0.75 ) {
              return 'high';
            }
            else {
              return 'medium';
            }
          } ),
          isStill: new DerivedProperty( [ model.isStringStillProperty ], isFlat => isFlat ? 'true' : 'false' )
        } ),
        WaveOnAStringFluent.a11y.screenSummary.currentDetails.end.createProperty( {
          endPosition: new DerivedProperty( [ model.stringEndTypeProperty ], endType => {
            return {
              [ WOASEndType.FIXED_END.toString() ]: 'fixed',
              [ WOASEndType.LOOSE_END.toString() ]: 'loose',
              [ WOASEndType.NO_END.toString() ]: 'no'
            }[ endType.toString() ] as 'fixed' | 'loose' | 'no';
          } )
        } )
      ],
      interactionHintContent: WaveOnAStringFluent.a11y.screenSummary.interactionHint.createProperty( {
        mode: modeStringProperty
      } )
    } );
  }
}

waveOnAString.register( 'WOASScreenSummaryContent', WOASScreenSummaryContent );