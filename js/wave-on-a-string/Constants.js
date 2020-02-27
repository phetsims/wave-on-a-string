// Copyright 2013-2020, University of Colorado Boulder


import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import Vector2 from '../../../dot/js/Vector2.js';
import merge from '../../../phet-core/js/merge.js';
import SimpleDragHandler from '../../../scenery/js/input/SimpleDragHandler.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Color from '../../../scenery/js/util/Color.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../scenery/js/util/RadialGradient.js';
import waveOnAString from '../waveOnAString.js';

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

  dragAndDropHandler( thisNode, callback, startCallback, endCallback, tandem ) {
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
      },
      tandem: tandem
    } );
  }
};

waveOnAString.register( 'Constants', Constants );

Constants.viewBounds = Constants.viewSize.toBounds();

// TODO: doc
Constants.boundedDragHandler = function( node, positionProperty, padding, tandem ) {
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
    },
    tandem: tandem
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

export default Constants;