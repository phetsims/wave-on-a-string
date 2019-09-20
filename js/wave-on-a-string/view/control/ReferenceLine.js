// Copyright 2013-2019, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  function ReferenceLine( model ) {
    Node.call( this, { cursor: 'pointer' } );

    const self = this;

    self.addChild( new Rectangle( 740 * 2, -10, 40, 20, {
      fill: Constants.referenceLineBlockGradient,
      scale: 0.5,
      stroke: '#000',
      lineWidth: 0.5
    } ) );
    self.addChild( new Rectangle( 750, -10, 20, 20, {
      fill: Constants.referenceLineBlockGradient,
      stroke: '#000',
      lineWidth: 0.5
    } ) );
    self.addChild( new Line( 0, 0, 750, 0, _.extend( {
      mouseArea: new Bounds2( 0, 0, 750, 0 ).dilated( 5 ),
      touchArea: new Bounds2( 0, 0, 750, 0 ).dilated( 10 )
    }, {
      stroke: '#F00',
      lineDash: [ 10, 6 ],
      lineWidth: 2
    } ) ) );

    model.referenceLineProperty.link( function updateLineVisible( value ) {
      self.setVisible( value );
    } );
    model.referenceLineLocProperty.link( function updateLineLocation( value ) {
      self.translation = value;
    } );
    self.touchArea = Shape.bounds( Bounds2.point( 755, 0 ).dilated( Constants.dilatedReferenceLineTouchArea ) );
    self.mouseArea = Shape.bounds( Bounds2.point( 755, 0 ).dilatedXY( 15, 10 ) );

    Constants.boundedDragHandler( self, model.referenceLineLocProperty, 30 );
  }

  waveOnAString.register( 'ReferenceLine', ReferenceLine );

  inherit( Node, ReferenceLine );
  return ReferenceLine;
} );
