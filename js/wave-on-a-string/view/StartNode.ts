// Copyright 2013-2025, University of Colorado Boulder

/**
 * Left-side "start" view (wrench/oscillator/pulse)
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { m3 } from '../../../../dot/js/Matrix3.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import platform from '../../../../phet-core/js/platform.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import { WOASMode } from '../model/WOASMode.js';
import WrenchNode from './WrenchNode.js';
import type WOASModel from '../model/WOASModel.js';
import { offsetWheel, postGradient } from '../WOASConstants.js';
import PulseButton from './PulseButton.js';

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

    this.wrench = new WrenchNode( model, options.tandem );

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
          this.wrench.addAccessibleContextResponse( WaveOnAStringFluent.a11y.string.stillContextResponseStringProperty.value );
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
      this.wrench,
      new Node( { children: [ wheel ], translation: offsetWheel } )
    ];

    this.mutate( options );

    // TODO: Please add documentation, see https://github.com/phetsims/wave-on-a-string/issues/177
    const updateKey = () => {
      if ( this.wrench.isVisible() ) {
        this.wrench.y = model.yNow[ 0 ];
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
      if ( this.wrench.isVisible() !== wrenchIsVisible ) {
        this.wrench.visible = wrenchIsVisible;

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