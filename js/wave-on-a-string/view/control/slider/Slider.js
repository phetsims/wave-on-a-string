// Copyright 2013-2015, University of Colorado Boulder

/**
 * view for slider control
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Util = require( 'DOT/Util' );
  var Property = require( 'AXON/Property' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var HSlider = require( 'SUN/HSlider' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );

  function Slider( options ) {
    var self = this;
    var defaultOptions = {
      type: 'simple',
      property: new Property( 0 ),
      range: new RangeWithValue( 0, 100 ),
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
    };
    Node.call( self );
    options = _.extend( {}, defaultOptions, options );
    if ( !options.endDrag && options.round ) {
      options.endDrag = function() {
        options.property.set( Util.toFixed( options.property.get(), options.roundingDigits ) );
      };
    }

    self.addChild( new Rectangle( 0, 0, options.sliderSize.width, options.sliderSize.height ) );

    this.addChild( new Text( options.title, {
      centerX: self.width / 2,
      centerY: options.titleVerticalOffset + 10,
      font: new PhetFont( 18 ),
      maxWidth: 150
    } ) );

    var buttonNode;
    var plusButton;
    var minusButton;
    var valueLabel;
    var hSlider = new HSlider( options.property, options.range, options );
    var hSliderNode = new Node( {
      children: [ hSlider ],
      x: (self.width - options.trackSize.width) / 2,
      bottom: self.height - 0
    } );
    self.addChild( hSliderNode );

    if ( options.type === 'simple' && options.tick && options.tick.step ) {
      var i = options.range.min;

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
      var buttonPropertyUpdate = function( value ) {
        return function() {
          options.property.set( Math.max( Math.min( options.property.get() + value, options.range.max ), options.range.min ) );
        };
      };
      buttonNode.addChild( plusButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), {
        right: self.width,
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
        centerX: self.width / 2,
        top: 0
      } ) );
      buttonNode.addChild( valueLabel = new Text( '0', {
        font: new PhetFont( 18 ),
        centerX: self.width / 2,
        centerY: 15,
        maxWidth: 80
      } ) );
      this.addChild( buttonNode );
    }

    //self.mutate( _.extend( _.omit( options, Object.keys( defaultOptions ) ) ) );

    options.property.link( function updateProperty( value ) {
      if ( options.type === 'button' ) {
        var text = value;
        if ( options.round && options.roundingDigits >= 0 ) {
          text = Util.toFixed( options.property.get(), options.roundingDigits );
        }
        valueLabel.text = StringUtils.format( options.patternValueUnit, text );
        valueLabel.centerX = self.width / 2;
        plusButton.enabled = ( value < options.range.max );
        minusButton.enabled = ( value > options.range.min );
      }
    } );
  }

  waveOnAString.register( 'Slider', Slider );

  inherit( Node, Slider );

  return Slider;
} );
