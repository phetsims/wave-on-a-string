// Copyright 2020-2025, University of Colorado Boulder

/**
 * A customized-appearance NumberControl for Wave on a String
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';

class WOASNumberControl extends NumberControl {
  /**
   * @param {string} title
   * @param {Property.<number>} numberProperty
   * @param {Object} [options]
   */
  constructor( title, numberProperty, options ) {
    options = merge( {
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        return new VBox( {
          spacing: 5,
          resize: false,
          align: 'center',
          children: [
            titleNode,
            new VBox( {
              spacing: 15,
              resize: false,
              align: 'center',
              children: [
                new HBox( {
                  spacing: 5,
                  children: [ leftArrowButton, numberDisplay, rightArrowButton ]
                } ),
                slider
              ]
            } )
          ]
        } );
      },

      sliderOptions: WOASNumberControl.getSliderOptions(),

      numberDisplayOptions: {
        textOptions: {
          font: new PhetFont( 18 )
        },
        maxWidth: 120,
        xMargin: 20,
        yMargin: 5,
        backgroundStroke: 'black',
        cornerRadius: 5
      },

      titleNodeOptions: {
        font: new PhetFont( 18 ),
        maxWidth: 150
      }
    }, options );

    super( title, numberProperty, numberProperty.range, options );
  }

  /**
   * Returns the default slider options.
   * @public
   *
   * @returns {Object}
   */
  static getSliderOptions() {
    return {
      trackSize: new Dimension2( 140, 2 ),
      trackFill: 'black',

      thumbSize: new Dimension2( 22, 38 ),
      thumbFillEnabled: Constants.sliderUp,
      thumbFillHighlighted: Constants.sliderOver
    };
  }
}

waveOnAString.register( 'WOASNumberControl', WOASNumberControl );
export default WOASNumberControl;