/**
 * Copyright 2002-2013, University of Colorado
 * Rulers view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var Strings = require( 'Strings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function WOASTRulers( model ) {
    Node.call( this, { cursor: "pointer" } );
    var rulerH = new RulerNode( 800, 50, 80, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], Strings.unitCm, {minorTicksPerMajorTick: 4, unitsFont: '16px Arial' } ),
      rulerV = new RulerNode( 400, 50, 80, ["0", "1", "2", "3", "4", "5"], Strings.unitCm, {minorTicksPerMajorTick: 4, unitsFont: '16px Arial' } );
    rulerV.rotate( -Math.PI / 2 );
    this.addChild( rulerH );
    this.addChild( rulerV );

    model.rulersProperty.link( function updateRulersVisible( value ) {
      rulerH.setVisible( value );
      rulerV.setVisible( value );
    } );
    model.rulerLocHProperty.link( function updateRulerHLocation( value ) {
      rulerH.x = model.rulerLocH.x;
      rulerH.y = model.rulerLocH.y;

    } );
    model.rulerLocVProperty.link( function updateRulerVLocation( value ) {
      rulerV.x = model.rulerLocV.x;
      rulerV.y = model.rulerLocV.y;
    } );
    var rulerHClickOffset = {x: 0, y: 0},
      rulerVClickOffset = {x: 0, y: 0};
    rulerV.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          rulerVClickOffset.x = rulerV.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          rulerVClickOffset.y = rulerV.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          var x = rulerV.globalToParentPoint( event.pointer.point ).x - rulerVClickOffset.x,
            y = rulerV.globalToParentPoint( event.pointer.point ).y - rulerVClickOffset.y;
          model.rulerLocV = { x: x, y: y };
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );
    rulerH.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          rulerHClickOffset.x = rulerH.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          rulerHClickOffset.y = rulerH.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          var x = rulerH.globalToParentPoint( event.pointer.point ).x - rulerHClickOffset.x,
            y = rulerH.globalToParentPoint( event.pointer.point ).y - rulerHClickOffset.y;
          model.rulerLocH = { x: x, y: y };
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );
  }

  inherit( Node, WOASTRulers );
  return WOASTRulers;
} );