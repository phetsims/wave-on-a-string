// Copyright 2020, University of Colorado Boulder

/**
 * A customized-appearance NumberControl for Wave on a String
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( require => {
  'use strict';

  // modules
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

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
          font: new PhetFont( 18 ),
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

  return waveOnAString.register( 'WOASNumberControl', WOASNumberControl );
} );
