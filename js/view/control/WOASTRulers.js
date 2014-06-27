/**
 * Copyright 2002-2013, University of Colorado
 * Rulers view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var unitCmString = require( 'string!WOAS/unitCm' );
  var Util = require( 'DOT/Util' );
  var Constants = require( 'WOAS/Constants' );

  function WOASTRulers( model ) {
    Node.call( this, { cursor: 'pointer' } );
    var rulerH = new RulerNode( 800, 50, 80, Util.rangeInclusive( 0, 10 ).map( function( n ) { return n + ''; } ), unitCmString, {minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ) } ),
      rulerV = new RulerNode( 400, 50, 80, Util.rangeInclusive( 0, 5 ).map( function( n ) { return n + ''; } ), unitCmString, {minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ) } );
    rulerV.rotate( -Math.PI / 2 );
    this.addChild( rulerH );
    this.addChild( rulerV );

    model.rulersProperty.link( function updateRulersVisible( value ) {
      rulerH.setVisible( value );
      rulerV.setVisible( value );
    } );
    model.rulerLocHProperty.link( function updateRulerHLocation( value ) {
      rulerH.translation = value;
    } );
    model.rulerLocVProperty.link( function updateRulerVLocation( value ) {
      rulerV.translation = value;
    } );
    rulerV.addInputListener( Constants.dragAndDropHandler( rulerV, function( point ) {model.rulerLocV = point; } ) );
    rulerH.addInputListener( Constants.dragAndDropHandler( rulerH, function( point ) {model.rulerLocH = point; } ) );
  }

  inherit( Node, WOASTRulers );
  return WOASTRulers;
} );
