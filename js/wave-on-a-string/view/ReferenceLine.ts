// Copyright 2013-2025, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';
import type WOASModel from '../model/WOASModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ReferenceLine extends Node {
  public constructor( model: WOASModel, tandem: Tandem ) {
    super( { cursor: 'pointer', tandem: tandem } );

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

    this.addInputListener( new DragListener( {
      positionProperty: model.referenceLinePositionProperty,
      tandem: tandem.createTandem( 'dragListener' ),
      dragBoundsProperty: new Property( new Bounds2(
        Constants.VIEW_BOUNDS.minX + 30 - Constants.VIEW_BOUNDS.width,
        Constants.VIEW_BOUNDS.minY + 30,
        Constants.VIEW_BOUNDS.maxX - Constants.VIEW_BOUNDS.width,
        Constants.VIEW_BOUNDS.maxY - 30
      ) )
    } ) );
  }
}

waveOnAString.register( 'ReferenceLine', ReferenceLine );