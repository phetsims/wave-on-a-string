/**
 * Copyright 2002-2013, University of Colorado
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function WOASTLine( model ) {
    Node.call( this, { cursor: 'pointer' } );
    var thisNode = this,
      lineGradient = new LinearGradient( 0, -10, 0, 20 )
        .addColorStop( 0, '#78571C' )
        .addColorStop( 0.3, '#D3B072' )
        .addColorStop( 1, '#78571C' );

    thisNode.addChild( new Rectangle( 740 * 2, -10, 40, 20, {fill: lineGradient, scale: 0.5, stroke: '#000', lineWidth: 0.5} ) );
    thisNode.addChild( new Rectangle( 750, -10, 20, 20, {fill: lineGradient, stroke: '#000', lineWidth: 0.5} ) );
    thisNode.addChild( new Line( 0, 0, 750, 0, {
      stroke: '#F00',
      lineDash: [10, 6],
      lineWidth: 2
    } ) );

    model.referenceLineProperty.link( function updateLineVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.referenceLineLocProperty.link( function updateLineLocation( value ) {
      //REVIEW: once model.referenceLineLoc is a Vector2, you can actually just type 'thisNode.translation = model.referenceLineLoc' here
      thisNode.x = model.referenceLineLoc.x;
      thisNode.y = model.referenceLineLoc.y;
    } );
    thisNode.touchArea = Shape.bounds( Bounds2.point( 755, 0 ).dilated( 20 ) );
    thisNode.mouseArea = Shape.bounds( Bounds2.point( 755, 0 ).dilatedXY( 15, 10 ) );
    //REVIEW: please use DOT/Vector2 for 2D data
    var lineClickOffset = {x: 0, y: 0};
    //REVIEW: a lot of this code is duplicated between WOASTLine / WOASTRulers / WOASTTimer. reduce duplication?
    thisNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          //REVIEW: equivalent to 'lineClickOffset = thisNode.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation )', although result will be a Vector2
          lineClickOffset.x = thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          lineClickOffset.y = thisNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          //REVIEW: should use 'model.referenceLineLoc = thisNode.globalToParentPoint( event.pointer.point ).minus( lineClickOffset )'
          var x = thisNode.globalToParentPoint( event.pointer.point ).x - lineClickOffset.x,
            y = thisNode.globalToParentPoint( event.pointer.point ).y - lineClickOffset.y;
          model.referenceLineLoc = { x: x, y: y };
        }
      } ) );
  }

  inherit( Node, WOASTLine );
  return WOASTLine;
} );
