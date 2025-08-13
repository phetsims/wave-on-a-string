// Copyright 2025, University of Colorado Boulder

/**
 * Paragraphs (and header) describing the wave generation of the play area
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import WOASModel from '../model/WOASModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { WOASEndType } from '../model/WOASEndType.js';
import { WOASMode } from '../model/WOASMode.js';
import Node from '../../../../scenery/js/nodes/Node.js';

const MODE_MAP = new Map<WOASMode, 'manual' | 'oscillate' | 'pulse'>( [
  [ WOASMode.MANUAL, 'manual' ],
  [ WOASMode.OSCILLATE, 'oscillate' ],
  [ WOASMode.PULSE, 'pulse' ]
] );

export default class WaveGenerationParagraphsNode extends Node {

  /**
   * @param model - This class is responsible for describing the wave generation of the play area so it takes the entire model and is coupled to it.
   */
  public constructor( model: WOASModel ) {
    const modeStringProperty = new DerivedProperty( [ model.waveModeProperty ], mode => MODE_MAP.get( mode )! );

    super( {
      accessibleHeading: WaveOnAStringFluent.a11y.headings.playArea.waveGenerationStringProperty,
      children: [
        WaveOnAStringFluent.a11y.screenSummary.currentDetails.start.createProperty( {
          isPlaying: new DerivedProperty( [ model.isPlayingProperty ], isPlaying => isPlaying ? 'true' : 'false' ),
          wrenchPosition: new DerivedProperty( [ model.leftMostBeadYProperty ], y => y > 0.5 ? 'top' : y < -0.5 ? 'bottom' : 'middle' ),
          mode: modeStringProperty,
          active: new DerivedProperty( [ model.waveModeProperty, model.isPulseActiveProperty ], ( mode, isPulseActive ) => {
            return ( mode !== WOASMode.PULSE || isPulseActive ) ? 'true' : 'false';
          } ),
          amplitude: new DerivedProperty( [ model.amplitudeProperty ], amplitude => {
            const magnitude = Math.abs( amplitude );
            return magnitude < 1e-3 ? 'zero' :
                   magnitude < 0.4 ? 'low' :
                   magnitude > 0.9 ? 'high' : 'medium';
          } ),
          frequency: new DerivedProperty( [ model.frequencyProperty ], frequency => {
            const magnitude = Math.abs( frequency );
            return magnitude < 1e-3 ? 'zero' :
                   magnitude < 1 ? 'low' :
                   magnitude > 2 ? 'high' : 'medium';
          } ),
          pulseWidth: new DerivedProperty( [ model.pulseWidthProperty ], pulseWidth => {
            return pulseWidth < 0.35 ? 'low' :
                   pulseWidth > 0.75 ? 'high' : 'medium';
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
      ].map( stringProperty => new Node( { tagName: 'p', innerContent: stringProperty } ) )
    } );
  }
}

waveOnAString.register( 'WaveGenerationParagraphsNode', WaveGenerationParagraphsNode );