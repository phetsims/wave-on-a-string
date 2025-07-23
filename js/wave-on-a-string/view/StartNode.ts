// Copyright 2013-2025, University of Colorado Boulder

/**
 * Left-side "start" view (wrench/oscillator/pulse)
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import MappedProperty from '../../../../axon/js/MappedProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { m3 } from '../../../../dot/js/Matrix3.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import wrench_png from '../../../images/wrench_png.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import { WOASMode } from '../model/WOASMode.js';
import type WOASModel from '../model/WOASModel.js';
import { dilatedTouchArea, MAX_START_AMPLITUDE_CM, MODEL_UNITS_PER_CM, offsetWheel, postGradient } from '../WOASConstants.js';
import PulseButton from './PulseButton.js';
import WOASColors from './WOASColors.js';

type SelfOptions = EmptySelfOptions;

export type StartNodeOptions = WithRequired<NodeOptions, 'tandem'> & SelfOptions;

export default class StartNode extends Node {
  // Exposed for a11y ordering globally
  public readonly wrench: Node;
  public readonly pulseButton: Node;

  public constructor( model: WOASModel, frameEmitter: Emitter, providedOptions?: StartNodeOptions ) {
    const options = optionize<StartNodeOptions, SelfOptions, NodeOptions>()( {
      layerSplit: true
    }, providedOptions );

    const postNodeHeight = 158;
    const maxAmplitude = MAX_START_AMPLITUDE_CM * MODEL_UNITS_PER_CM;

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

    // Rasterization of the wheel for performance
    wheel = rasterizeNode( wheel, {
      resolution: 3
    } );
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

    const wrench = new ( InteractiveHighlighting( Node ) )( combineOptions<NodeOptions>( {
      children: [
        wrenchImageNode,
        wrenchTopArrow,
        wrenchBottomArrow
      ],
      cursor: 'pointer',

      accessibleName: WaveOnAStringFluent.a11y.wrench.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.wrench.accessibleHelpTextStringProperty
    }, AccessibleDraggableOptions ) );
    this.wrench = wrench;

    wrenchTopArrow.touchArea = wrenchTopArrow.localBounds.dilated( 6 );
    wrenchBottomArrow.touchArea = wrenchBottomArrow.localBounds.dilated( 6 );
    wrench.touchArea = Shape.bounds( wrenchImageNode.bounds.dilated( dilatedTouchArea ) );
    wrench.mouseArea = Shape.bounds( wrenchImageNode.bounds );


    /*---------------------------------------------------------------------------*
     * Post
     *----------------------------------------------------------------------------*/
    const post = new Rectangle( offsetWheel.x - 5, 0, 10, postNodeHeight, {
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

    const pulseButton = new PulseButton( model, {
      center: pistonBox.center,
      tandem: options.tandem.createTandem( 'pulseButton' )
    } );
    this.pulseButton = pulseButton;

    pistonBox.addChild( pulseButton );

    model.isStringStillProperty.lazyLink( isStill => {
      if ( isStill ) {
        if ( model.waveModeProperty.value === WOASMode.MANUAL ) {
          wrench.addAccessibleContextResponse( WaveOnAStringFluent.a11y.string.stillContextResponseStringProperty.value );
        }
        else if ( model.waveModeProperty.value === WOASMode.PULSE ) {
          pulseButton.addAccessibleContextResponse( WaveOnAStringFluent.a11y.string.stillContextResponseStringProperty.value );
        }
        else {
          // nothing desired for oscillation mode? https://github.com/phetsims/wave-on-a-string/issues/163#issuecomment-3075168872
        }
      }
    } );

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

        model.nextLeftYProperty.value = clamp( point.y, -maxAmplitude, maxAmplitude );
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      end: () => {
        model.wrenchArrowsVisibleProperty.value = false;
      }
    } ) );

    wrench.addInputListener( new SoundKeyboardDragListener( {
      tandem: options.tandem.createTandem( 'wrenchKeyboardDragListener' ),
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
        wrench.addAccessibleObjectResponse( WaveOnAStringFluent.a11y.valuePatterns.centimeters.format( {
          value: toFixed( model.leftMostBeadYProperty.value, 2 )
        } ) );
      }
    } ) );

    model.wrenchArrowsVisibleProperty.link( visible => {
      wrenchTopArrow.visible = visible;
      wrenchBottomArrow.visible = visible;
    } );

    this.mutate( options );

    // TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177
    const updateKey = () => {
      if ( wrench.isVisible() ) {
        wrench.y = model.yNow[ 0 ];
      }
    };

    // TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177
    const updatePost = () => {
      const y = model.yNow[ 0 ];
      if ( post.isVisible() ) {

        // TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177// TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177
        post.matrix = m3(
          1, 0, 0,

          // TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177
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

    model.angleProperty.link( angle => {
      wheel.rotation = angle;
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