// Copyright 2013-2020, University of Colorado Boulder

/**
 * Left-side "start" view (wrench/oscillator/pulse)
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import platform from '../../../../phet-core/js/platform.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import wrenchImage from '../../../images/wrench_png.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';
import WOASModel from '../model/WOASModel.js';
import PulseButton from './PulseButton.js';

class StartNode extends Node {
  /**
   * @param {WOASModel} model
   * @param {Emitter} frameEmitter
   * @param {Object} [options]
   */
  constructor( model, frameEmitter, options ) {
    options = merge( {
      layerSplit: true
    }, options );

    const postNodeHeight = 158;
    const postScale = 3;

    super();

    /*---------------------------------------------------------------------------*
     * Oscillation wheel
     *----------------------------------------------------------------------------*/
    const wheelRadius = 29.5;
    let wheel = new Circle( wheelRadius, {
      stroke: '#333',
      lineWidth: 1.5,
      fill: new LinearGradient( -wheelRadius, 0, wheelRadius, 0 ).addColorStop( 0, 'rgb(215,210,210)' ).addColorStop( 1, 'rgb(215,210,210)' )
    } );

    const innerWheelRadius = 4.8;
    wheel.addChild( new Circle( innerWheelRadius, {
      stroke: '#333',
      lineWidth: 1.5,
      fill: '#fff'
    } ) );
    wheel.addChild( new Line( -innerWheelRadius, 0, innerWheelRadius, 0, { stroke: '#333', lineWidth: 1.5 } ) );
    wheel.addChild( new Circle( innerWheelRadius, {
      x: innerWheelRadius * 1.5 - wheelRadius,
      stroke: '#333',
      lineWidth: 0.5,
      fill: new RadialGradient( 0, 0, 0, 0, 0, innerWheelRadius ).addColorStop( 0.2, '#555' ).addColorStop( 1, '#555' )
    } ) );

    // toImage* style conversion of the wheel if necessary for performance
    const wheelImageScale = 3;
    wheel.scale( wheelImageScale );
    const wheelSize = Math.ceil( wheel.width / 2 ) + 2;
    wheel = wheel.toDataURLNodeSynchronous( wheelSize, wheelSize, 2 * wheelSize, 2 * wheelSize );
    if ( platform.firefox ) {
      wheel.renderer = 'canvas';
    }

    /*---------------------------------------------------------------------------*
     * Wrench
     *----------------------------------------------------------------------------*/
    const wrenchImageNode = new Image( wrenchImage, { x: -40, y: -24, scale: 0.9 / 4, pickable: false } );
    const wrenchArrowOptions = {
      fill: 'hsl(210,90%,60%)',
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
    const wrench = new Node( {
      children: [
        wrenchImageNode,
        wrenchTopArrow,
        wrenchBottomArrow
      ], cursor: 'pointer'
    } );

    wrenchTopArrow.touchArea = wrenchTopArrow.localBounds.dilated( 6 );
    wrenchBottomArrow.touchArea = wrenchBottomArrow.localBounds.dilated( 6 );
    wrench.touchArea = Shape.bounds( wrenchImageNode.bounds.dilated( Constants.dilatedTouchArea ) );
    wrench.mouseArea = Shape.bounds( wrenchImageNode.bounds );


    /*---------------------------------------------------------------------------*
     * Post
     *----------------------------------------------------------------------------*/
    let post = new Rectangle( Constants.offsetWheel.x - 5, 0, 10, postNodeHeight, {
      stroke: '#000',
      fill: Constants.postGradient
    } );

    /*---------------------------------------------------------------------------*
     * Piston Box
     *----------------------------------------------------------------------------*/
    const pistonBox = new ShadedRectangle( Bounds2.point( Constants.offsetWheel.x, Constants.offsetWheel.y ).dilatedXY( 40, 25 ), {
      baseColor: new Color( 200, 200, 200 ),
      lightFactor: 0.5,
      lighterFactor: 0.1,
      darkFactor: 0.5,
      darkerFactor: 0.1,
      cornerRadius: 6
    } );

    pistonBox.addChild( new PulseButton( model, {
      center: pistonBox.center,
      tandem: options.tandem.createTandem( 'pulseButton' )
    } ) );

    // cache the post as an image, since otherwise with the current Scenery its gradient is updated every frame in the defs (NOTE: remove this with Scenery 0.2?)
    const postCache = new Node( { scale: 1 / postScale } );
    new Node( { children: [ post ], scale: postScale } ).toImageNodeAsynchronous( image => {
      postCache.addChild( image );
    } );
    post = new Node( { children: [ postCache ] } );

    this.children = [
      post,
      pistonBox,
      wrench,
      new Node( { children: [ wheel ], translation: Constants.offsetWheel } )
    ];

    wrench.addInputListener( Constants.dragAndDropHandler( wrench, point => {
      model.nextLeftYProperty.value = Math.max( Math.min( point.y, options.range.max ), options.range.min );
      model.isPlayingProperty.value = true;
      model.yNowChangedEmitter.emit();
    }, event => {
      if ( event.target !== wrenchTopArrow && event.target !== wrenchBottomArrow ) {
        model.wrenchArrowsVisibleProperty.value = false;
      }
    }, event => {
      model.wrenchArrowsVisibleProperty.value = false;
    }, options.tandem.createTandem( 'wrenchDragAndDropHandler' ) ) );
    model.wrenchArrowsVisibleProperty.link( visible => {
      wrenchTopArrow.visible = visible;
      wrenchBottomArrow.visible = visible;
    } );

    this.mutate( options );

    const updateKey = () => {
      if ( wrench.isVisible() ) {
        wrench.y = model.yNow[ 0 ];
      }
    };

    const updatePost = () => {
      const y = model.yNow[ 0 ];
      if ( post.isVisible() ) {
        post.matrix = Matrix3.createFromPool(
          1, 0, 0,
          0, ( Constants.offsetWheel.y - ( y + 7 ) ) / postNodeHeight, y + 7,
          0, 0, 1
        );
      }
    };

    let dirty = true;
    model.yNowChangedEmitter.addListener( () => {
      dirty = true;
    } );
    frameEmitter.addListener( () => {
      if ( dirty ) {
        updateKey();
        updatePost();
        dirty = false;
      }
    } );

    const wheelScaleMatrix = Matrix3.scale( 1 / wheelImageScale );
    model.angleProperty.link( angle => {
      wheel.matrix = Matrix3.rotation2( angle ).timesMatrix( wheelScaleMatrix ); // doesn't need to compute current transform, or do matrix multiplication
    } );
    model.modeProperty.link( mode => {
      const wrenchIsVisible = mode === WOASModel.Mode.MANUAL;
      if ( wrench.isVisible() !== wrenchIsVisible ) {
        wrench.visible = wrenchIsVisible;

        updateKey();
      }

      const postIsVisible = mode !== WOASModel.Mode.MANUAL;
      if ( post.isVisible() !== postIsVisible ) {
        post.visible = postIsVisible;

        updatePost();
      }

      wheel.visible = mode === WOASModel.Mode.OSCILLATE;
      pistonBox.visible = mode === WOASModel.Mode.PULSE;
    } );
  }
}

waveOnAString.register( 'StartNode', StartNode );
export default StartNode;