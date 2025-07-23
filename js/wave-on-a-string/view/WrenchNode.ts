// Copyright 2025, University of Colorado Boulder

/**
 * Wrench on the "start"/left side of the simulation
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import MappedProperty from '../../../../axon/js/MappedProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import wrench_png from '../../../images/wrench_png.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import type WOASModel from '../model/WOASModel.js';
import { dilatedTouchArea, MAX_START_AMPLITUDE_CM, MODEL_UNITS_PER_CM } from '../WOASConstants.js';
import WOASColors from './WOASColors.js';

export default class WrenchNode extends InteractiveHighlighting( Node ) {
  public constructor( model: WOASModel, startNodeTandem: Tandem ) {
    const maxAmplitude = MAX_START_AMPLITUDE_CM * MODEL_UNITS_PER_CM;

    const wrenchImageNode = new Image( wrench_png, {
      x: -40,
      y: -24,
      scale: 0.9 / 4,
      pickable: false
    } );

    const wrenchArrowOptions = {
      fill: WOASColors.wrenchArrowColorProperty,
      tailWidth: 10,
      headWidth: 22,
      headHeight: 18
    };
    const wrenchArrowXOffset = 8;
    const wrenchArrowYOffset = 10;
    const wrenchTopArrow = new ArrowNode( wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.top - wrenchArrowYOffset,
      wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.top - 30 - wrenchArrowYOffset, wrenchArrowOptions );
    const wrenchBottomArrow = new ArrowNode( wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.bottom + wrenchArrowYOffset,
      wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.bottom + 30 + wrenchArrowYOffset, wrenchArrowOptions );

    super( combineOptions<NodeOptions>( {
      children: [
        wrenchImageNode,
        wrenchTopArrow,
        wrenchBottomArrow
      ],
      cursor: 'pointer',

      accessibleName: WaveOnAStringFluent.a11y.wrench.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.wrench.accessibleHelpTextStringProperty
    }, AccessibleDraggableOptions ) );

    wrenchTopArrow.touchArea = wrenchTopArrow.localBounds.dilated( 6 );
    wrenchBottomArrow.touchArea = wrenchBottomArrow.localBounds.dilated( 6 );
    this.touchArea = Shape.bounds( wrenchImageNode.bounds.dilated( dilatedTouchArea ) );
    this.mouseArea = Shape.bounds( wrenchImageNode.bounds );

    let clickOffset = new Vector2( 0, 0 );
    this.addInputListener( new DragListener( {
      tandem: startNodeTandem.createTandem( 'wrenchDragListener' ),
      start: event => {
        clickOffset = this.globalToParentPoint( event.pointer.point );
        if ( event.currentTarget ) {
          clickOffset = clickOffset.minus( event.currentTarget.translation );
        }

        if ( event.target !== wrenchTopArrow && event.target !== wrenchBottomArrow ) {

          // TODO: Should the arrows be hidden if the user uses the keyboard to move the wrench? See https://github.com/phetsims/wave-on-a-string/issues/162
          model.wrenchArrowsVisibleProperty.value = false;
        }
      },
      drag: event => {
        const point = this.globalToParentPoint( event.pointer.point ).minus( clickOffset );

        model.nextLeftYProperty.value = clamp( point.y, -maxAmplitude, maxAmplitude );
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      end: () => {
        model.wrenchArrowsVisibleProperty.value = false;
      }
    } ) );

    this.addInputListener( new SoundKeyboardDragListener( {
      tandem: startNodeTandem.createTandem( 'wrenchKeyboardDragListener' ),
      dragSpeed: 600,
      shiftDragSpeed: 150,
      positionProperty: new MappedProperty( model.nextLeftYProperty, {
        bidirectional: true,
        map: ( y: number ) => new Vector2( 0, y ),
        inverseMap: ( vector: Vector2 ) => vector.y
      } ),
      keyboardDragDirection: 'upDown',
      dragBoundsProperty: new TinyProperty( new Bounds2( 0, -maxAmplitude, 0, maxAmplitude ) ),
      start: () => {
        model.wrenchArrowsVisibleProperty.value = false;
      },
      drag: () => {
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      end: () => {
        model.wrenchArrowsVisibleProperty.value = false;

        // Alert displacement on drag end, see https://github.com/phetsims/wave-on-a-string/issues/163#issuecomment-3075168872
        this.addAccessibleObjectResponse( WaveOnAStringFluent.a11y.valuePatterns.centimeters.format( {
          value: toFixed( model.leftMostBeadYProperty.value, 2 )
        } ) );
      }
    } ) );

    model.wrenchArrowsVisibleProperty.link( visible => {
      wrenchTopArrow.visible = visible;
      wrenchBottomArrow.visible = visible;
    } );
  }
}

waveOnAString.register( 'WrenchNode', WrenchNode );