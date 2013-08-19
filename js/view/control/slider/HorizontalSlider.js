/**
 * Copyright 2002-2013, University of Colorado
 * view for horizontal slider control
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  function HorizontalSlider( x, y, w, targetProperty, img, value, rounding, tick ) {
    var thisNode = this;
    Node.call( this, {x: x, y: y} );

    var round = function( value, rounding ) {
      if ( rounding === false ) {
        return value;
      }
      else {
        return Math.round( value * Math.pow( 10, rounding ) ) / Math.pow( 10, rounding );
      }
    };

    var track = new Node( {children: [new Image( img, {centerX: 0, centerY: 0} )], cursor: "pointer"} ),
      clickXOffset,
      xMin = 0,
      xMax = w - track.width,
      valueToPosition = new LinearFunction( value.min, value.max, xMin, xMax, true ),
      positionToValue = new LinearFunction( xMin, xMax, value.min, value.max, true ),
      nodeTick = new Node();

    this.addChild( new Path( { shape: Shape.lineSegment( 0, 0, w - track.width, 0 ), stroke: 'black', lineWidth: 3 } ) );

    if ( tick && tick.step ) {
      var i = value.min,
        tickHeight;

      for ( ; i <= value.max; i += tick.step ) {
        tickHeight = 23;
        if ( i === value.max || i === value.min || i === (value.min + value.max) / 2 ) {
          tickHeight = 30;
        }
        nodeTick.addChild( new Path( { shape: Shape.lineSegment( valueToPosition( i ), -5, valueToPosition( i ), -tickHeight ), stroke: 'black', lineWidth: 1 } ) );
      }
      nodeTick.addChild( new Text( tick.minText, {centerX: xMin, bottom: -33, fontSize: 15} ) );
      nodeTick.addChild( new Text( tick.maxText, {centerX: xMax, bottom: -33, fontSize: 15} ) );
    }
    this.addChild( nodeTick );
    this.addChild( track );
    var dx = 0.25 * track.width,
      dy = 0.5 * track.height;
    track.touchArea = Shape.rectangle( ( -track.width / 2 ) - dx, ( -track.height / 2 ) - dy, track.width + dx + dx, track.height + dy + dy );
    track.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,
        start: function( event ) {
          clickXOffset = thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
        },
        drag: function( event ) {
          var x = thisNode.globalToParentPoint( event.pointer.point ).x - clickXOffset;
          x = Math.max( Math.min( x, xMax ), xMin );
          targetProperty.set( round( positionToValue( x ), rounding ) );
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );
    targetProperty.link( function( value ) {
      track.x = valueToPosition( value );
    } );
    this.x += track.width / 2;
  }

  inherit( Node, HorizontalSlider );

  return HorizontalSlider;
} );