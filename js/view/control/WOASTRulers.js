/**
 * Copyright 2002-2013, University of Colorado
 * Rulers view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var unitCmString = require( 'string!WOAS/unitCm' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function WOASTRulers( model ) {
    Node.call( this, { cursor: "pointer" } );
    //REVIEW: optional, but DOT/Util.rangeInclusive( 0, 10 ).map( function( n ) { return n+''; } ) is a general way of creating string ranges
    var rulerH = new RulerNode( 800, 50, 80, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], unitCmString, {minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ) } ),
      rulerV = new RulerNode( 400, 50, 80, ["0", "1", "2", "3", "4", "5"], unitCmString, {minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ) } );
    rulerV.rotate( -Math.PI / 2 );
    this.addChild( rulerH );
    this.addChild( rulerV );

    model.rulersProperty.link( function updateRulersVisible( value ) {
      rulerH.setVisible( value );
      rulerV.setVisible( value );
    } );
    model.rulerLocHProperty.link( function updateRulerHLocation( value ) {
      //REVIEW: once rulerLocH is a Vector2, just use "rulerH.translation = model.rulerLocH"
      rulerH.x = model.rulerLocH.x;
      rulerH.y = model.rulerLocH.y;
    } );
    model.rulerLocVProperty.link( function updateRulerVLocation( value ) {
      //REVIEW: once rulerLocV is a Vector2, just use "rulerV.translation = model.rulerLocV"
      rulerV.x = model.rulerLocV.x;
      rulerV.y = model.rulerLocV.y;
    } );
    /*rulerV.touchArea = Shape.bounds( Bounds2.rect(0,0,430,50).dilated(10) );
    rulerV.mouseArea = Shape.bounds( Bounds2.rect(0,0,430,50) );
    rulerH.touchArea = Shape.bounds( Bounds2.rect(0,0,830,50).dilated(10) );
    rulerH.mouseArea = Shape.bounds( Bounds2.rect(0,0,830,50) );*/
    //REVIEW: best to use Vector2 for 2D numeric data here
    var rulerHClickOffset = {x: 0, y: 0},
      rulerVClickOffset = {x: 0, y: 0};
    //REVIEW: a lot of this code is duplicated between WOASTLine / WOASTRulers / WOASTTimer. reduce duplication?
    rulerV.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          rulerVClickOffset.x = rulerV.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          rulerVClickOffset.y = rulerV.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          var x = rulerV.globalToParentPoint( event.pointer.point ).x - rulerVClickOffset.x,
            y = rulerV.globalToParentPoint( event.pointer.point ).y - rulerVClickOffset.y;
          model.rulerLocV = { x: x, y: y };
        }
      } ) );
    rulerH.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          rulerHClickOffset.x = rulerH.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          rulerHClickOffset.y = rulerH.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          var x = rulerH.globalToParentPoint( event.pointer.point ).x - rulerHClickOffset.x,
            y = rulerH.globalToParentPoint( event.pointer.point ).y - rulerHClickOffset.y;
          model.rulerLocH = { x: x, y: y };
        }
      } ) );
  }

  inherit( Node, WOASTRulers );
  return WOASTRulers;
} );
