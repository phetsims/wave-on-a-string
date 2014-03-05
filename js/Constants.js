// Copyright 2002-2013, University of Colorado

define( function( require ) {
  'use strict';

  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Range = require( 'DOT/Range' );

  var clickOffset = new Vector2();
  var Constants = {
    projectName: 'wave-on-a-string',
    viewSize: new Dimension2( 768, 504 ),

    dilatedTouchArea: 10,
    dilatedReferenceLineTouchArea: 20,
    segmentTheStringNodeRadius: 5,
    yTheStringNode: 215,
    startTheStringNode: 70,
    endTheStringNode: 670,
    yKeyRange: new Range( -120, 120 ),
    maxWidthBottomControlPanel: 1000,
    tensionRange: new Range( 0, 2 ),
    dampingRange: new Range( 0, 100 ),
    frequencyRange: new Range( 0, 3 ),
    pulseWidthRange: new Range( 0, 1 ),
    amplitudeRange: new Range( 0, 3 ),

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
