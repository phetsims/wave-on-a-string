// Copyright 2013-2019, University of Colorado Boulder

/**
 * end object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );

  // images
  const clampImage = require( 'image!WAVE_ON_A_STRING/clamp.png' );
  const ringBackImage = require( 'image!WAVE_ON_A_STRING/ring_back.png' );
  const ringFrontImage = require( 'image!WAVE_ON_A_STRING/ring_front.png' );
  const windowImage = require( 'image!WAVE_ON_A_STRING/window-back.png' );

  /**
   * @constructor
   * @param {WOASModel} model
   * @param {[type]} frameEmitter - emits an event when animation frame changes
   * @param {Object} [options]
   */
  function EndNode( model, frameEmitter, options ) {
    Node.call( this );
    const clamp = new Image( clampImage, { x: -17, y: -31, scale: 0.4 } );
    const ring_back = new Node( { children: [ new Image( ringBackImage, { x: 5, y: -14 / 2, scale: 0.5 } ) ] } );
    const ring_front = new Node( { children: [ new Image( ringFrontImage, { x: 4.7, y: 0, scale: 0.5 } ) ] } );
    const windowNode = new Image( windowImage, { right: Constants.windowXOffset + Constants.windowShift, centerY: 0, scale: Constants.windowScale } );
    const post = new Rectangle( -5, -130, 10, 260, {
      stroke: '#000',
      fill: Constants.postGradient,
      x: 20
    } );

    this.addChild( clamp );
    this.addChild( ring_back );
    this.addChild( post );
    this.addChild( ring_front );
    this.windowNode = windowNode;

    this.mutate( options );

    function updateRing() {
      ring_front.y = ring_back.y = model.yNow[ model.yNow.length - 1 ] || 0;
    }

    let dirty = true;
    model.yNowChanged.addListener( function() { dirty = true; } );
    frameEmitter.addListener( function() {
      if ( dirty ) {
        updateRing();
        dirty = false;
      }
    } );

    model.endTypeProperty.link( function updateVisible( value ) {
      clamp.setVisible( value === WOASModel.EndType.FIXED_END );
      ring_back.setVisible( value === WOASModel.EndType.LOOSE_END );
      post.setVisible( value === WOASModel.EndType.LOOSE_END );
      ring_front.setVisible( value === WOASModel.EndType.LOOSE_END );
      windowNode.setVisible( value === WOASModel.EndType.NO_END );

      if ( value === WOASModel.EndType.FIXED_END ) {
        model.zeroOutEndPoint();
      }
    } );
  }

  waveOnAString.register( 'EndNode', EndNode );

  inherit( Node, EndNode );

  return EndNode;
} );
