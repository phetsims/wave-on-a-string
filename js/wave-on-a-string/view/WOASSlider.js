// Copyright 2013-2019, University of Colorado Boulder

/**
 * Slider control for WOAS
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  class WOASSlider extends Node {
    /**
     * @param {Object} options
     */
    constructor( options ) {
      super();

      options = merge( {
        type: 'simple',
        property: new Property( 0 ),
        range: new Range( 0, 100 ),
        sliderSize: new Dimension2( 140 + 24, 110 ),
        tick: { step: 1, minText: '', maxText: '' },
        title: '',
        patternValueUnit: '',
        buttonStep: 1,
        round: true,
        roundingDigits: 2,

        // custom track
        trackSize: new Dimension2( 140, 2 ),
        trackFill: 'black',

        // custom thumb
        thumbSize: new Dimension2( 22, 38 ),
        thumbFillEnabled: Constants.sliderUp,
        thumbFillHighlighted: Constants.sliderOver,

        // custom ticks
        tickLabelSpacing: 4,
        majorTickLength: 20,
        minorTickLength: 8,
        majorTickLineWidth: 1.5,
        minorTickLineWidth: 1.5,

        titleVerticalOffset: 0
      }, options );

      if ( !options.endDrag && options.round ) {
        options.endDrag = () => {
          options.property.value = Utils.toFixedNumber( options.property.value, options.roundingDigits );
        };
      }

      this.addChild( new Rectangle( 0, 0, options.sliderSize.width, options.sliderSize.height ) );

      this.addChild( new Text( options.title, {
        centerX: this.width / 2,
        centerY: options.titleVerticalOffset + 10,
        font: new PhetFont( 18 ),
        maxWidth: 150
      } ) );

      let buttonNode;
      let plusButton;
      let minusButton;
      let valueLabel;
      const hSlider = new HSlider( options.property, options.range, options );
      const hSliderNode = new Node( {
        children: [ hSlider ],
        x: ( this.width - options.trackSize.width ) / 2,
        bottom: this.height - 0
      } );
      this.addChild( hSliderNode );

      if ( options.type === 'simple' && options.tick && options.tick.step ) {
        let i = options.range.min;

        for ( ; i <= options.range.max; i += options.tick.step ) {

          if ( i === options.range.max ) {
            hSlider.addMajorTick( i, new Text( options.tick.maxText, { font: new PhetFont( 15 ), maxWidth: 40 } ) );
          }
          else if ( i === options.range.min ) {
            hSlider.addMajorTick( i, new Text( options.tick.minText, { font: new PhetFont( 15 ), maxWidth: 40 } ) );
          }
          else if ( i === (options.range.min + options.range.max) / 2 ) {
            hSlider.addMajorTick( i );
          }
          else {
            hSlider.addMinorTick( i );
          }
        }
      }

      if ( options.type === 'button' ) {
        buttonNode = new Node( { y: 25 } );
        const buttonPropertyUpdate = value => {
          return () => {
            options.property.value = Math.max( Math.min( options.property.value + value, options.range.max ), options.range.min );
          };
        };
        buttonNode.addChild( plusButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), {
          right: this.width,
          centerY: 15
        } ) );
        buttonNode.addChild( minusButton = new ArrowButton( 'left', buttonPropertyUpdate( -options.buttonStep ), {
          left: 0,
          centerY: 15
        } ) );
        buttonNode.addChild( new Rectangle( 0, 0, 90, 30, 5, 5, {
          fill: '#FFF',
          stroke: '#000',
          lineWidth: 1,
          centerX: this.width / 2,
          top: 0
        } ) );
        buttonNode.addChild( valueLabel = new Text( '0', {
          font: new PhetFont( 18 ),
          centerX: this.width / 2,
          centerY: 15,
          maxWidth: 80
        } ) );
        this.addChild( buttonNode );
      }

      options.property.link( value => {
        if ( options.type === 'button' ) {
          let text = value;
          if ( options.round && options.roundingDigits >= 0 ) {
            text = Utils.toFixed( options.property.value, options.roundingDigits );
          }
          valueLabel.text = StringUtils.format( options.patternValueUnit, text );
          valueLabel.centerX = this.width / 2;
          plusButton.enabled = ( value < options.range.max );
          minusButton.enabled = ( value > options.range.min );
        }
      } );
    }
  }

  return waveOnAString.register( 'WOASSlider', WOASSlider );
} );
