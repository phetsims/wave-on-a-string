// Copyright 2020-2025, University of Colorado Boulder

/**
 * A customized-appearance NumberControl for Wave on a String
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import { HEADER_FONT, NORMAL_FONT } from '../WOASConstants.js';
import WOASColors from './WOASColors.js';

type SelfOptions = EmptySelfOptions;
type SuperOptions = NumberControlOptions;
export type WOASNumberControlOptions = SelfOptions & SuperOptions;

class WOASNumberControl extends NumberControl {
  public constructor(
    title: TReadOnlyProperty<string>,
    numberProperty: TRangedProperty,
    providedOptions?: WOASNumberControlOptions
  ) {
    const options = optionize<WOASNumberControlOptions, SelfOptions, SuperOptions>()( {

      // NOTE: Different desired spacing needed between the title and the rest (vs the other vertical spacing).
      // Otherwise, fairly similar to createLayoutFunction3
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        return new VBox( {
          spacing: 5,
          align: 'center',
          children: [
            titleNode,
            new VBox( {
              spacing: 10,
              align: 'center',
              children: [
                new HBox( {
                  spacing: 5,
                  children: [
                    ...( leftArrowButton ? [ leftArrowButton ] : [] ),
                    numberDisplay,
                    ...( rightArrowButton ? [ rightArrowButton ] : [] )
                  ]
                } ),
                slider
              ]
            } )
          ]
        } );
      },

      sliderOptions: {
        trackSize: new Dimension2( 135, 2 ),
        trackFillEnabled: WOASColors.sliderTrackFillProperty,

        // thumbSize: new Dimension2( 22, 38 ),
        thumbFill: WOASColors.sliderThumbFillProperty,
        thumbFillHighlighted: WOASColors.sliderThumbHighlightedFillProperty
      },

      numberDisplayOptions: {
        textOptions: {
          font: NORMAL_FONT
        },
        maxWidth: 83,
        xMargin: 20,
        yMargin: 5,
        backgroundStroke: WOASColors.numberDisplayBackgroundStrokeProperty,
        cornerRadius: 5
      },

      titleNodeOptions: {
        font: HEADER_FONT,
        maxWidth: 150,
        tandem: Tandem.OPT_OUT
      },

      accessibleName: title
    }, providedOptions );

    super( title, numberProperty, numberProperty.range, options );
  }
}

waveOnAString.register( 'WOASNumberControl', WOASNumberControl );
export default WOASNumberControl;