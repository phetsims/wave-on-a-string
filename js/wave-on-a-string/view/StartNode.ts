// Copyright 2013-2025, University of Colorado Boulder

/**
 * Left-side "start" view (wrench/oscillator/pulse)
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3, { m3 } from '../../../../dot/js/Matrix3.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { toDataURLNodeSynchronous, toImageNodeAsynchronous } from '../../../../scenery/js/util/rasterizeNode.js';
import wrench_png from '../../../images/wrench_png.js';
import waveOnAString from '../../waveOnAString.js';
import { WOASMode } from '../model/WOASMode.js';
import type WOASModel from '../model/WOASModel.js';
import { dilatedTouchArea, offsetWheel, postGradient } from '../WOASConstants.js';
import PulseButton from './PulseButton.js';

type SelfOptions = {
  range: Range;
};

export type StartNodeOptions = WithRequired<NodeOptions, 'tandem'> & SelfOptions;

export default class StartNode extends Node {
  public constructor( model: WOASModel, frameEmitter: Emitter, providedOptions?: StartNodeOptions ) {
    const options = optionize<StartNodeOptions, SelfOptions, NodeOptions>()( {
      layerSplit: true
    }, providedOptions );

    const postNodeHeight = 158;
    const postScale = 3;

    super();

    /*---------------------------------------------------------------------------*
     * Oscillation wheel
     *----------------------------------------------------------------------------*/
    const wheelRadius = 29.5;
    let wheel: Node = new Circle( wheelRadius, {
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
    wheel = toDataURLNodeSynchronous( wheel, wheelSize, wheelSize, 2 * wheelSize, 2 * wheelSize );
    if ( platform.firefox ) {
      wheel.renderer = 'canvas';
    }

    /*---------------------------------------------------------------------------*
     * Wrench
     *----------------------------------------------------------------------------*/
    const wrenchImageNode = new Image( wrench_png, {
      x: -40,
      y: -24,
      scale: 0.9 / 4,
      pickable: false,

      // Will only be focusable when visible
      focusable: true,
      tagName: 'p'
    } );

    const wrenchKeyboardListener = new KeyboardListener( {
      keys: [ 'arrowUp', 'arrowDown', 'w', 's' ],
      fire: ( event, keysPressed, listener ) => {

        // TODO: Decide the behavior of the wrench arrows when using the keyboard to move the wrench. See https://github.com/phetsims/wave-on-a-string/issues/162
        const KEY_MOVEMENT_AMOUNT = options.range.getLength() / 4;
        if ( keysPressed === 'arrowUp' || keysPressed === 'w' ) {
          model.nextLeftYProperty.value = Math.max( model.nextLeftYProperty.value - KEY_MOVEMENT_AMOUNT, options.range.min );
        }
        else if ( keysPressed === 'arrowDown' || keysPressed === 's' ) {
          model.nextLeftYProperty.value = Math.min( model.nextLeftYProperty.value + KEY_MOVEMENT_AMOUNT, options.range.max );
        }

        // TODO: There is more logic in wrench.addInputListener( new DragListener( {... that we need to replicate or factor out. https://github.com/phetsims/wave-on-a-string/issues/162
      }
    } );


    wrenchImageNode.addInputListener( wrenchKeyboardListener );
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
      ],
      cursor: 'pointer'
    } );

    wrenchTopArrow.touchArea = wrenchTopArrow.localBounds.dilated( 6 );
    wrenchBottomArrow.touchArea = wrenchBottomArrow.localBounds.dilated( 6 );
    wrench.touchArea = Shape.bounds( wrenchImageNode.bounds.dilated( dilatedTouchArea ) );
    wrench.mouseArea = Shape.bounds( wrenchImageNode.bounds );


    /*---------------------------------------------------------------------------*
     * Post
     *----------------------------------------------------------------------------*/
    let post: Node = new Rectangle( offsetWheel.x - 5, 0, 10, postNodeHeight, {
      stroke: '#000',
      fill: postGradient
    } );

    /*---------------------------------------------------------------------------*
     * Piston Box
     *----------------------------------------------------------------------------*/
    const pistonBox = new ShadedRectangle( Bounds2.point( offsetWheel.x, offsetWheel.y ).dilatedXY( 40, 25 ), {
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
    toImageNodeAsynchronous( new Node( { children: [ post ], scale: postScale } ), image => {
      postCache.addChild( image );
    } );
    post = new Node( { children: [ postCache ] } );

    this.children = [
      post,
      pistonBox,
      wrench,
      new Node( { children: [ wheel ], translation: offsetWheel } )
    ];

    let clickOffset = new Vector2( 0, 0 );
    wrench.addInputListener( new DragListener( {
      tandem: options.tandem.createTandem( 'wrenchDragListener' ),
      start: event => {
        clickOffset = wrench.globalToParentPoint( event.pointer.point );
        if ( event.currentTarget ) {
          clickOffset = clickOffset.minus( event.currentTarget.translation );
        }

        if ( event.target !== wrenchTopArrow && event.target !== wrenchBottomArrow ) {

          // TODO: Should the arrows be hidden if the user uses the keyboard to move the wrench? See https://github.com/phetsims/wave-on-a-string/issues/162
          model.wrenchArrowsVisibleProperty.value = false;
        }
      },
      drag: event => {
        const point = wrench.globalToParentPoint( event.pointer.point ).minus( clickOffset );

        model.nextLeftYProperty.value = Math.max( Math.min( point.y, options.range.max ), options.range.min );
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      end: () => {
        model.wrenchArrowsVisibleProperty.value = false;
      }
    } ) );

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
        post.matrix = m3(
          1, 0, 0,
          0, ( offsetWheel.y - ( y + 7 ) ) / postNodeHeight, y + 7,
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
    model.waveModeProperty.link( mode => {
      const wrenchIsVisible = mode === WOASMode.MANUAL;
      if ( wrench.isVisible() !== wrenchIsVisible ) {
        wrench.visible = wrenchIsVisible;

        updateKey();
      }

      const postIsVisible = mode !== WOASMode.MANUAL;
      if ( post.isVisible() !== postIsVisible ) {
        post.visible = postIsVisible;

        updatePost();
      }

      wheel.visible = mode === WOASMode.OSCILLATE;
      pistonBox.visible = mode === WOASMode.PULSE;
    } );
  }
}

waveOnAString.register( 'StartNode', StartNode );