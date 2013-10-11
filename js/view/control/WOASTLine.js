/**
 * Copyright 2002-2013, University of Colorado
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function WOASTLine( model ) {
    Node.call( this, { cursor: "pointer" } );
    var thisNode = this,
      arrowShape = new Shape(),
      lineGradient = new LinearGradient( 0, -10, 0, 20 )
        .addColorStop( 0, "#78571C" )
        .addColorStop( 0.3, "#D3B072" )
        .addColorStop( 1, "#78571C" );
    arrowShape.moveTo( 0, 0 );
    arrowShape.lineTo( 750, 0 );
    //REVIEW: this rectangle has no stroke or fill, so isn't displayed. please document its purpose (is it to change the line's bounds? is it the 'clickable' area?)
    this.addChild( new Rectangle( 0, -5, 750, 10, {} ) );
    this.addChild( new Rectangle( 740 * 2, -10, 40, 20, {fill: lineGradient, scale: 0.5, stroke: '#000', lineWidth: 0.5} ) );
    this.addChild( new Rectangle( 750, -10, 20, 20, {fill: lineGradient, stroke: '#000', lineWidth: 0.5} ) );
    this.addChild( new Path( arrowShape, {
      stroke: "#F00",
      lineDash: [10, 6],
      lineWidth: 2
    } ) );

    model.referenceLineProperty.link( function updateLineVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.referenceLineLocProperty.link( function updateLineLocation( value ) {
      //REVIEW: once model.referenceLineLoc is a Vector2, you can actually just type "thisNode.translation = model.referenceLineLoc" here
      thisNode.x = model.referenceLineLoc.x;
      thisNode.y = model.referenceLineLoc.y;
    } );
    //REVIEW: please use DOT/Vector2 for 2D data
    var lineClickOffset = {x: 0, y: 0};
    //REVIEW: a lot of this code is duplicated between WOASTLine / WOASTRulers / WOASTTimer. reduce duplication?
    thisNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          //REVIEW: equivalent to "lineClickOffset = thisNode.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation )", although result will be a Vector2
          lineClickOffset.x = thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          lineClickOffset.y = thisNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          //REVIEW: should use "model.referenceLineLoc = thisNode.globalToParentPoint( event.pointer.point ).minus( lineClickOffset )"
          var x = thisNode.globalToParentPoint( event.pointer.point ).x - lineClickOffset.x,
            y = thisNode.globalToParentPoint( event.pointer.point ).y - lineClickOffset.y;
          model.referenceLineLoc = { x: x, y: y };
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );
  }

  inherit( Node, WOASTLine );
  return WOASTLine;
} );
