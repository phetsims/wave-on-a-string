// Copyright 2013-2020, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  class ReferenceLine extends Node {
    /**
     * @param {WOASModel} model
     */
    constructor( model ) {
      super( { cursor: 'pointer' } );

      this.addChild( new Rectangle( 740 * 2, -10, 40, 20, {
        fill: Constants.referenceLineBlockGradient,
        scale: 0.5,
        stroke: '#000',
        lineWidth: 0.5
      } ) );
      this.addChild( new Rectangle( 750, -10, 20, 20, {
        fill: Constants.referenceLineBlockGradient,
        stroke: '#000',
        lineWidth: 0.5
      } ) );
      this.addChild( new Line( 0, 0, 750, 0, merge( {
        mouseArea: new Bounds2( 0, 0, 750, 0 ).dilated( 5 ),
        touchArea: new Bounds2( 0, 0, 750, 0 ).dilated( 10 )
      }, {
        stroke: '#F00',
        lineDash: [ 10, 6 ],
        lineWidth: 2
      } ) ) );

      model.referenceLineVisibleProperty.link( visible => {
        this.visible = visible;
      } );
      model.referenceLinePositionProperty.link( position => {
        this.translation = position;
      } );

      this.touchArea = Shape.bounds( Bounds2.point( 755, 0 ).dilated( Constants.dilatedReferenceLineTouchArea ) );
      this.mouseArea = Shape.bounds( Bounds2.point( 755, 0 ).dilatedXY( 15, 10 ) );

      Constants.boundedDragHandler( this, model.referenceLinePositionProperty, 30 );
    }
  }

  return waveOnAString.register( 'ReferenceLine', ReferenceLine );
} );
