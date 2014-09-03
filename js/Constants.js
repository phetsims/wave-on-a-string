// Copyright 2002-2013, University of Colorado

define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );
  var Color = require( 'SCENERY/util/Color' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  var clickOffset = new Vector2();
  var Constants = {
    projectName: 'wave-on-a-string',
    viewSize: new Dimension2( 768, 504 ),

    // prefer 200 hue
    blueUpColor: new Color( 'hsl(210,70%,75%)' ),
    blueOverColor: new Color( 'hsl(210,90%,80%)' ),
    blueDisabledColor: new Color( 'rgb(180,180,180)' ),
    blueDownColor: new Color( 'hsl(210,80%,70%)' ),
    radioColor: new Color( 'hsl(210,90%,77%)' ),
    sliderUp: new Color( 'hsl(210,50%,63%)' ),
    sliderOver: new Color( 'hsl(210,70%,73%)' ),
    buttonBorder0: new Color( 'transparent' ),
    buttonBorder1: new Color( 'transparent' ),

    dilatedTouchArea: 10,
    dilatedReferenceLineTouchArea: 20,
    segmentTheStringNodeRadius: 5,
    yTheStringNode: 215,
    startTheStringNode: 70,
    endTheStringNode: 670,
    yWrenchRange: new Range( -100, 100 ),
    maxWidthBottomControlPanel: 1000,
    tensionRange: new Range( 0, 2 ),
    dampingRange: new Range( 0, 100 ),
    frequencyRange: new Range( 0, 3 ),
    pulseWidthRange: new Range( 0.2, 1 ),
    amplitudeRange: new Range( 0, 1.5 ),

    postGradient: new LinearGradient( -5, 0, 5, 0 )
      .addColorStop( 0, '#666' )
      .addColorStop( 0.3, '#FFF' )
      .addColorStop( 1, '#666' ),
    referenceLineBlockGradient: new LinearGradient( 0, -10, 0, 20 )
      .addColorStop( 0, '#78571C' )
      .addColorStop( 0.3, '#D3B072' )
      .addColorStop( 1, '#78571C' ),
    segmentTheStringNodeGradient: function( options ) {
      return new RadialGradient( -options.radius * 0.5, -options.radius * 0.5, 1, -options.radius * 0.5, -options.radius * 0.5, options.radius )
        .addColorStop( 0, '#FFF' )
        .addColorStop( 0.3, options.color );
    },
    referenceLineOptions: {
      stroke: '#F00',
      lineDash: [10, 6],
      lineWidth: 2
    },

    // window image scale
    windowScale: 0.6,

    // how much the window front should overlap the window back
    windowXOffset: 5,

    // how much to horizontally shift the window (to center)
    windowShift: 1,

    offsetWheel: new Vector2( 0, 156 ),

    dragAndDropHandler: function dnd( thisNode, callback ) {
      return new SimpleDragHandler( {
        start: function( event ) {
          clickOffset = thisNode.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
        },
        drag: function( event ) {
          callback( thisNode.globalToParentPoint( event.pointer.point ).minus( clickOffset ) );
        }
      } );
    }
  };

  return Constants;
} )
;
