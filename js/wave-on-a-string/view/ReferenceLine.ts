// Copyright 2013-2025, University of Colorado Boulder

/**
 * reference line Node.
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import type WOASModel from '../model/WOASModel.js';
import { dilatedReferenceLineTouchArea, MODEL_UNITS_PER_CM, referenceLineBlockGradient } from '../WOASConstants.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WOASColors from './WOASColors.js';

export default class ReferenceLine extends InteractiveHighlighting( Node ) {
  public constructor(
    model: WOASModel,
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem,
    dragBoundsProperty: TReadOnlyProperty<Bounds2>
  ) {
    super( combineOptions<NodeOptions>( {
      cursor: 'pointer',
      tandem: tandem,
      visibleProperty: model.referenceLineVisibleProperty,
      accessibleName: WaveOnAStringFluent.a11y.referenceLine.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.referenceLine.accessibleHelpTextStringProperty
    }, AccessibleDraggableOptions ) );

    const referenceX = ScreenView.DEFAULT_LAYOUT_BOUNDS.right - 28;

    // The "handle"
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
      stroke: WOASColors.referenceLineColorProperty,
      lineDash: [ 10, 6 ],
      lineWidth: 2
    } ) );

    model.referenceLinePositionProperty.link( position => {
      this.translation = position;
    } );

    this.touchArea = Shape.bounds( Bounds2.point( referenceX + 15, 0 ).dilated( dilatedReferenceLineTouchArea ) );
    this.mouseArea = Shape.bounds( Bounds2.point( referenceX + 15, 0 ).dilatedXY( 15, 10 ) );

    this.addInputListener( new SoundDragListener( {
      positionProperty: model.referenceLinePositionProperty,
      tandem: tandem.createTandem( 'dragListener' ),
      dragBoundsProperty: dragBoundsProperty
    } ) );

    // Alert displacement on drag end or focus, see https://github.com/phetsims/wave-on-a-string/issues/163#issuecomment-3075168872
    const alertDisplacement = () => {
      // Alert the displacement in centimeters
      this.addAccessibleObjectResponse( WaveOnAStringFluent.a11y.valuePatterns.centimeters.format( {
        value: toFixed( -modelViewTransform.viewToModelY( model.referenceLinePositionProperty.value.y ) / MODEL_UNITS_PER_CM, 2 )
      } ) );
    };

    this.addInputListener( new SoundKeyboardDragListener( {
      tandem: tandem.createTandem( 'keyboardDragListener' ),
      dragSpeed: 300,
      shiftDragSpeed: 20,
      positionProperty: model.referenceLinePositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      end: alertDisplacement
    } ) );

    this.addInputListener( {
      focus: alertDisplacement
    } );
  }
}

waveOnAString.register( 'ReferenceLine', ReferenceLine );