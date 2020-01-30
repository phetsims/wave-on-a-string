// Copyright 2013-2019, University of Colorado Boulder

/**
 * View of the right-side end
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );

  // images
  const clampImage = require( 'image!WAVE_ON_A_STRING/clamp.png' );
  const ringBackImage = require( 'image!WAVE_ON_A_STRING/ring_back.png' );
  const ringFrontImage = require( 'image!WAVE_ON_A_STRING/ring_front.png' );
  const windowImage = require( 'image!WAVE_ON_A_STRING/window-back.png' );

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
      model.yNowChanged.addListener( () => {
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

  return waveOnAString.register( 'EndNode', EndNode );
} );
