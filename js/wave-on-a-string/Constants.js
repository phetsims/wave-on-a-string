// Copyright 2013-2019, University of Colorado Boulder

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );
  const Range = require( 'DOT/Range' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  let clickOffset = new Vector2( 0, 0 );
  const Constants = {
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
    segmentStringNodeRadius: 5,
    yStringNode: 215,
    startStringNode: 70,
    endStringNode: 670,
    yWrenchRange: new Range( -100, 100 ),
    maxWidthBottomControlPanel: 1000,
    tensionRange: new Range( 0, 2 ),
    dampingRange: new Range( 0, 100 ),
    frequencyRange: new Range( 0, 3 ),
    pulseWidthRange: new Range( 0.2, 1 ),
    amplitudeRange: new Range( 0, 1.25 ),

    postGradient: new LinearGradient( -5, 0, 5, 0 )
      .addColorStop( 0, '#666' )
      .addColorStop( 0.3, '#FFF' )
      .addColorStop( 1, '#666' ),
    referenceLineBlockGradient: new LinearGradient( 0, -10, 0, 20 )
      .addColorStop( 0, '#78571C' )
      .addColorStop( 0.3, '#D3B072' )
      .addColorStop( 1, '#78571C' ),
    segmentStringNodeGradient: function( options ) {
      return new RadialGradient( -options.radius * 0.5, -options.radius * 0.5, 1, -options.radius * 0.5, -options.radius * 0.5, options.radius )
        .addColorStop( 0, '#FFF' )
        .addColorStop( 0.3, options.color );
    },

    // {number} - window image scale
    windowScale: 0.6,

    // {number} - how much the window front should overlap the window back
    windowXOffset: 5,

    // {number} - how much to horizontally shift the window (to center)
    windowShift: 1,

    offsetWheel: new Vector2( 0, 156 ),

    dragAndDropHandler: function dnd( thisNode, callback, startCallback, endCallback ) {
      return new SimpleDragHandler( {
        start: function( event, trail ) {
          clickOffset = thisNode.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
          startCallback && startCallback( event, trail );
        },
        drag: function( event ) {
          callback( thisNode.globalToParentPoint( event.pointer.point ).minus( clickOffset ) );
        },
        end: function( event, trail ) {
          endCallback && endCallback( event, trail );
        }
      } );
    }
  };

  waveOnAString.register( 'Constants', Constants );

  Constants.viewBounds = Constants.viewSize.toBounds();

  Constants.boundedDragHandler = function( node, positionProperty, padding ) {
    const restrictedBounds = Constants.viewBounds.eroded( padding );
    let clickOffset = new Vector2( 0, 0 );
    node.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        clickOffset = node.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
      },
      drag: function( event ) {
        const point = node.globalToParentPoint( event.pointer.point ).minus( clickOffset );

        if ( node.right < restrictedBounds.minX ) {
          point.x += -node.right + restrictedBounds.minX;
        }
        if ( node.left > restrictedBounds.maxX ) {
          point.x += -node.left + restrictedBounds.maxX;
        }
        if ( node.bottom < restrictedBounds.minY ) {
          point.y += -node.bottom + restrictedBounds.minY;
        }
        if ( node.top > restrictedBounds.maxY ) {
          point.y += -node.top + restrictedBounds.maxY;
        }

        positionProperty.value = point;
      }
    } ) );
  };

  Constants.toImageNode = function( domImage, width, height, scale, options ) {
    assert && assert( scale % 1 === 0, 'Only integral scales have been tested' );

    domImage.width = width;
    domImage.height = height;

    const canvas = document.createElement( 'canvas' );
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext( '2d' );
    context.scale( scale, scale );
    context.drawImage( domImage, 0, 0 );

    let url;
    try {
      url = canvas.toDataURL();
    }
    catch( e ) {
      url = canvas;
    }

    const sceneryImage = new Image( url, { scale: 1 / scale } );
    sceneryImage.localBounds = new Bounds2( 0, 0, width * scale, height * scale );

    return new Node( merge( { children: [ sceneryImage ] }, options ) );
  };

  return Constants;
} )
;
