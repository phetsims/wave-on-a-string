// Copyright 2002-2014, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );

  function ReferenceLine( model ) {
    Node.call( this, { cursor: 'pointer' } );

    var thisNode = this;

    thisNode.addChild( new Rectangle( 740 * 2, -10, 40, 20, {
      fill: Constants.referenceLineBlockGradient,
      scale: 0.5,
      stroke: '#000',
      lineWidth: 0.5
    } ) );
    thisNode.addChild( new Rectangle( 750, -10, 20, 20, { fill: Constants.referenceLineBlockGradient, stroke: '#000', lineWidth: 0.5 } ) );
    thisNode.addChild( new Line( 0, 0, 750, 0, _.extend( {
      mouseArea: new Bounds2( 0, 0, 750, 0 ).dilated( 5 ),
      touchArea: new Bounds2( 0, 0, 750, 0 ).dilated( 10 )
    }, {
      stroke: '#F00',
      lineDash: [ 10, 6 ],
      lineWidth: 2
    } ) ) );

    model.referenceLineProperty.link( function updateLineVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.referenceLineLocProperty.link( function updateLineLocation( value ) {
      thisNode.translation = value;
    } );
    thisNode.touchArea = Shape.bounds( Bounds2.point( 755, 0 ).dilated( Constants.dilatedReferenceLineTouchArea ) );
    thisNode.mouseArea = Shape.bounds( Bounds2.point( 755, 0 ).dilatedXY( 15, 10 ) );

    Constants.boundedDragHandler( thisNode, model.referenceLineLocProperty, 30 );
  }

  inherit( Node, ReferenceLine );
  return ReferenceLine;
} );
