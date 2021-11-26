// Copyright 2013-2020, University of Colorado Boulder

/**
 * View of the right-side end
 *
 * @author Anton Ulyanov (Mlearner)
 */

import { Image } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import clampImage from '../../../images/clamp_png.js';
import ringBackImage from '../../../images/ring_back_png.js';
import ringFrontImage from '../../../images/ring_front_png.js';
import windowImage from '../../../images/window-back_png.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';
import WOASModel from '../model/WOASModel.js';

class EndNode extends Node {
  /**
   * @param {WOASModel} model
   * @param {Emitter} frameEmitter - emits an event when animation frame changes
   * @param {Object} [options]
   */
  constructor( model, frameEmitter, options ) {
    super();

    const clamp = new Image( clampImage, { x: -17, y: -31, scale: 0.4 } );
    const ringBack = new Node( { children: [ new Image( ringBackImage, { x: 5, y: -14 / 2, scale: 0.5 } ) ] } );
    const ringFront = new Node( { children: [ new Image( ringFrontImage, { x: 4.7, y: 0, scale: 0.5 } ) ] } );
    const post = new Rectangle( -5, -130, 10, 260, {
      stroke: '#000',
      fill: Constants.postGradient,
      x: 20
    } );

    // @public {Node} - We need to visually stack this behind, so we can't add it as a child here
    this.windowNode = new Image( windowImage, {
      right: Constants.windowXOffset + Constants.windowShift,
      centerY: 0,
      scale: Constants.windowScale
    } );

    this.children = [
      clamp,
      ringBack,
      post,
      ringFront
    ];
    this.mutate( options );

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

    model.endTypeProperty.link( endType => {
      clamp.visible = endType === WOASModel.EndType.FIXED_END;
      ringBack.visible = post.visible = ringFront.visible = endType === WOASModel.EndType.LOOSE_END;
      this.windowNode.visible = endType === WOASModel.EndType.NO_END;

      if ( endType === WOASModel.EndType.FIXED_END ) {
        model.zeroOutEndPoint();
      }
    } );
  }
}

waveOnAString.register( 'EndNode', EndNode );
export default EndNode;