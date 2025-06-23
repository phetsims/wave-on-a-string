// Copyright 2013-2025, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import type WOASModel from '../model/WOASModel.js';
import { dilatedReferenceLineTouchArea, referenceLineBlockGradient } from '../WOASConstants.js';

export default class ReferenceLine extends Node {
  public constructor(
    model: WOASModel,
    tandem: Tandem,
    dragBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    super( {
      cursor: 'pointer',
      tandem: tandem,
      visibleProperty: model.referenceLineVisibleProperty
    } );

    model.referenceLinePositionProperty.link( console.log );

    const referenceX = ScreenView.DEFAULT_LAYOUT_BOUNDS.right - 28;

    this.addChild( new Rectangle( referenceX * 2, -10, 40, 20, {
      fill: referenceLineBlockGradient,
      scale: 0.5,
      stroke: '#000',
      lineWidth: 0.5
    } ) );
    this.addChild( new Rectangle( referenceX + 10, -10, 20, 20, {
      fill: referenceLineBlockGradient,
      stroke: '#000',
      lineWidth: 0.5
    } ) );
    this.addChild( new Line( 0, 0, referenceX + 10, 0, {
      mouseArea: new Bounds2( 0, 0, referenceX + 10, 0 ).dilated( 5 ),
      touchArea: new Bounds2( 0, 0, referenceX + 10, 0 ).dilated( 10 ),
      stroke: '#F00',
      lineDash: [ 10, 6 ],
      lineWidth: 2
    } ) );

    model.referenceLinePositionProperty.link( position => {
      this.translation = position;
    } );

    this.touchArea = Shape.bounds( Bounds2.point( referenceX + 15, 0 ).dilated( dilatedReferenceLineTouchArea ) );
    this.mouseArea = Shape.bounds( Bounds2.point( referenceX + 15, 0 ).dilatedXY( 15, 10 ) );

    this.addInputListener( new DragListener( {
      positionProperty: model.referenceLinePositionProperty,
      tandem: tandem.createTandem( 'dragListener' ),
      dragBoundsProperty: dragBoundsProperty
    } ) );
  }
}

waveOnAString.register( 'ReferenceLine', ReferenceLine );