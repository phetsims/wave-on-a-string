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
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'WOAS/Constants' );

  function ReferenceLine( model ) {
    Node.call( this, { cursor: 'pointer' } );

    var thisNode = this;

    thisNode.addChild( new Rectangle( 740 * 2, -10, 40, 20, {fill: Constants.referenceLineBlockGradient, scale: 0.5, stroke: '#000', lineWidth: 0.5} ) );
    thisNode.addChild( new Rectangle( 750, -10, 20, 20, {fill: Constants.referenceLineBlockGradient, stroke: '#000', lineWidth: 0.5} ) );
    thisNode.addChild( new Line( 0, 0, 750, 0, Constants.referenceLineOptions ) );

    model.referenceLineProperty.link( function updateLineVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.referenceLineLocProperty.link( function updateLineLocation( value ) {
      thisNode.translation = value;
    } );
    thisNode.touchArea = Shape.bounds( Bounds2.point( 755, 0 ).dilated( Constants.dilatedReferenceLineTouchArea ) );
    thisNode.mouseArea = Shape.bounds( Bounds2.point( 755, 0 ).dilatedXY( 15, 10 ) );

    thisNode.addInputListener( Constants.dragAndDropHandler( thisNode, function( point ) {model.referenceLineLoc = point; } ) );
  }

  inherit( Node, ReferenceLine );
  return ReferenceLine;
} );
