// Copyright 2013-2025, University of Colorado Boulder

/**
 * View of the right-side end
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import clamp_png from '../../../images/clamp_png.js';
import ringBack_png from '../../../images/ringBack_png.js';
import ringFront_png from '../../../images/ringFront_png.js';
import windowBack_png from '../../../images/windowBack_png.js';
import waveOnAString from '../../waveOnAString.js';
import type WOASModel from '../model/WOASModel.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { WOASEndType } from '../model/WOASEndType.js';
import { postGradient, SCALE_FROM_ORIGINAL, VIEW_END_X, VIEW_ORIGIN_Y, windowScale, windowShift, windowXOffset } from '../WOASConstants.js';

export default class EndNode extends Node {

  // Not a child of EndNode, but a separate Node that is positioned relative to EndNode.
  public readonly windowNode: Node;

  public constructor(
    model: WOASModel,
    frameEmitter: Emitter,
    providedOptions?: NodeOptions
  ) {
    super();

    const clamp = new Image( clamp_png, { x: -17, y: -31, scale: 0.4 } );
    const ringBack = new Node( { children: [ new Image( ringBack_png, { x: 5, y: -14 / 2, scale: 0.5 } ) ] } );
    const ringFront = new Node( { children: [ new Image( ringFront_png, { x: 4.7, y: 0, scale: 0.5 } ) ] } );
    const post = new Rectangle( -5, -130, 10, 260, {
      stroke: '#000',
      fill: postGradient,
      x: 20
    } );

    // We need to visually stack this behind, so we can't add it as a child here
    this.windowNode = new Image( windowBack_png, {
      right: windowXOffset + windowShift,
      centerY: 0,
      scale: windowScale * SCALE_FROM_ORIGINAL
    } );

    this.windowNode.x += VIEW_END_X;
    this.windowNode.y += VIEW_ORIGIN_Y;

    const options = combineOptions<NodeOptions>( {
      children: [
        clamp,
        ringBack,
        post,
        ringFront
      ]
    }, providedOptions );

    this.mutate( options );

    // Only update the ring on frames where it has changed
    let dirty = true;
    model.yNowChangedEmitter.addListener( () => {
      dirty = true;
    } );
    frameEmitter.addListener( () => {
      if ( dirty ) {
        ringFront.y = ringBack.y = model.getRingY();
        dirty = false;
      }
    } );

    // Update visibilities (on change)
    model.endTypeProperty.link( endType => {
      clamp.visible = endType === WOASEndType.FIXED_END;
      ringBack.visible = post.visible = ringFront.visible = endType === WOASEndType.LOOSE_END;
      this.windowNode.visible = endType === WOASEndType.NO_END;
    } );
  }
}

waveOnAString.register( 'EndNode', EndNode );