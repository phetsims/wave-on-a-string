// Copyright 2013-2025, University of Colorado Boulder

/**
 * Model object for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangedDynamicProperty from '../../../../axon/js/RangedDynamicProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Float64ArrayIO from '../../../../tandem/js/types/Float64ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import waveOnAString from '../../waveOnAString.js';
import { WOASEndType } from './WOASEndType.js';
import { WOASMode } from './WOASMode.js';
import { FRAMES_PER_SECOND, MODEL_UNITS_PER_CM, NUMBER_OF_BEADS, VIEW_ORIGIN_X } from '../WOASConstants.js';

// constants
const LAST_INDEX = NUMBER_OF_BEADS - 1;
const NEXT_TO_LAST_INDEX = NUMBER_OF_BEADS - 2;

export default class WOASModel extends PhetioObject {

  public yDraw: Float64Array = new Float64Array( NUMBER_OF_BEADS );
  public yNow: Float64Array = new Float64Array( NUMBER_OF_BEADS );
  public yLast: Float64Array = new Float64Array( NUMBER_OF_BEADS );
  public yNext: Float64Array = new Float64Array( NUMBER_OF_BEADS );

  public readonly waveModeProperty: Property<WOASMode>;
  public readonly endTypeProperty: Property<WOASEndType>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly timeSpeedProperty: Property<TimeSpeed>;

  // Visibilities
  public readonly rulersVisibleProperty: Property<boolean>;
  public readonly referenceLineVisibleProperty: Property<boolean>;
  public readonly wrenchArrowsVisibleProperty: Property<boolean>;

  public readonly horizontalRulerPositionProperty: Property<Vector2>;
  public readonly verticalRulerPositionProperty: Property<Vector2>;
  public readonly referenceLinePositionProperty: Property<Vector2>;

  public readonly tensionProperty: Property<number> & TRangedProperty;
  public readonly dampingProperty: Property<number> & TRangedProperty;
  public readonly frequencyProperty: Property<number> & TRangedProperty;
  public readonly pulseWidthProperty: Property<number> & TRangedProperty;
  public readonly amplitudeProperty: Property<number> & TRangedProperty;
  public readonly lastDtProperty: Property<number>;
  public readonly timeElapsedProperty: Property<number>;
  public readonly angleProperty: Property<number> & TRangedProperty;

  public readonly pulsePendingProperty: Property<boolean>;
  public readonly pulseSignProperty: Property<number>;
  public readonly pulseProperty: Property<boolean>;

  public readonly stopwatch: Stopwatch;

  public readonly yNowChangedEmitter: Emitter;

  public readonly nextLeftYProperty: TProperty<number>;
  public readonly waveStartPositionProperty: TRangedProperty;

  private readonly stepDtProperty: TProperty<number>;

  private alpha: number;
  private beta: number;

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem,
      phetioType: WOASModel.WOASModelIO
    } );

    this.waveModeProperty = new EnumerationProperty( WOASMode.MANUAL, {
      tandem: tandem.createTandem( 'waveModeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'what is on the left side of the string, controlling its motion'
    } );

    this.endTypeProperty = new EnumerationProperty( WOASEndType.FIXED_END, {
      tandem: tandem.createTandem( 'endTypeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'what is on the right side of the string'
    } );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether time is moving forward in the simulation (paused if false)',
      phetioFeatured: true
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true,
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      phetioDocumentation: 'the play speed for the simulation as it moves through time'
    } );

    this.rulersVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulersVisibleProperty' ),
      phetioDocumentation: 'whether the rulers are visible',
      phetioFeatured: true
    } );
    this.referenceLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'referenceLineVisibleProperty' ),
      phetioDocumentation: 'whether the reference line is visible',
      phetioFeatured: true
    } );
    this.wrenchArrowsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'wrenchArrowsVisibleProperty' ),
      phetioDocumentation: 'whether the up/down arrows on the wrench are visible'
    } );

    // NOTE: 14 is the insets for the ruler
    this.horizontalRulerPositionProperty = new Vector2Property( new Vector2( VIEW_ORIGIN_X - 14, 117 ), {
      tandem: tandem.createTandem( 'horizontalRulerPositionProperty' ),
      phetioDocumentation: 'position of the horizontal ruler in view coordinates (from the top-left of the ruler, initially 54,117)'
    } );
    this.verticalRulerPositionProperty = new Vector2Property( new Vector2( 13, 440 ), {
      tandem: tandem.createTandem( 'verticalRulerPositionProperty' ),
      phetioDocumentation: 'position of the vertical ruler in view coordinates (from the bottom-left of the ruler, initially 13,440)'
    } );
    this.referenceLinePositionProperty = new Vector2Property( new Vector2( -10, 120 ), {
      tandem: tandem.createTandem( 'referenceLinePositionProperty' ),
      phetioDocumentation: 'position of the reference line in view coordinates (from the left of the line, initially -10,120)'
    } );

    this.tensionProperty = new NumberProperty( 0.8, {
      range: new Range( 0.2, 0.8 ),
      tandem: tandem.createTandem( 'tensionProperty' ),
      phetioDocumentation: 'the relative amount of tension on the string'
    } );

    this.dampingProperty = new NumberProperty( 20, {
      range: new Range( 0, 100 ),
      tandem: tandem.createTandem( 'dampingProperty' ),
      phetioDocumentation: 'the relative amount of damping (percentage) for the string'
    } );

    this.frequencyProperty = new NumberProperty( 1.50, {
      range: new Range( 0, 3 ),
      tandem: tandem.createTandem( 'frequencyProperty' ),
      phetioDocumentation: 'the frequency of the oscillator, in hertz',
      units: 'Hz'
    } );

    this.pulseWidthProperty = new NumberProperty( 0.5, {
      range: new Range( 0.2, 1 ),
      tandem: tandem.createTandem( 'pulseWidthProperty' ),
      phetioDocumentation: 'the width of a pulse (generated with the pulse mode) in seconds',
      units: 's'
    } );

    this.amplitudeProperty = new NumberProperty( 0.75, {
      range: new Range( 0, 1.3 ),
      tandem: tandem.createTandem( 'amplitudeProperty' ),
      phetioDocumentation: 'the amplitude of the oscillation or pulses in centimeters',
      units: 'cm'
    } );

    this.lastDtProperty = new NumberProperty( 0.03, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'lastDtProperty' ),
      phetioDocumentation: 'the amount of time since the last manual internal step, in seconds'
    } );

    this.timeElapsedProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'timeElapsedProperty' ),
      phetioDocumentation: 'the amount of time elapsed since the last evolution of the physics model, in seconds'
    } );

    this.angleProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      range: new Range( 0, 2 * Math.PI ),
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioDocumentation: 'the angle (in radians) of the oscillator or pulse',
      units: 'radians'
    } );

    this.pulsePendingProperty = new BooleanProperty( false, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'pulsePendingProperty' ),
      phetioDocumentation: 'whether a pulse will start at the next internal model step'
    } );

    this.pulseSignProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      validValues: [ -1, 1 ],
      tandem: tandem.createTandem( 'pulseSignProperty' ),
      phetioDocumentation: 'which part of the pulse is being generated'
    } );

    this.pulseProperty = new BooleanProperty( false, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'pulseProperty' ),
      phetioDocumentation: 'whether a pulse is currently active'
    } );

    this.stopwatch = new Stopwatch( {
      position: new Vector2( 550, 330 ),
      tandem: tandem.createTandem( 'stopwatch' ),
      timePropertyOptions: {
        range: Stopwatch.ZERO_TO_ALMOST_SIXTY
      }
    } );

    this.yNowChangedEmitter = new Emitter();

    this.nextLeftYProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'nextLeftYProperty' ),
      phetioDocumentation: 'internal property used to interpolate the left-most y value of the string while the wrench is moved in manual mode - for low-fps browsers'
    } );

    this.waveStartPositionProperty = new RangedDynamicProperty( new Property( this.nextLeftYProperty ), {
      bidirectional: true,
      map: ( y: number ) => -y / MODEL_UNITS_PER_CM,
      inverseMap: ( y: number ) => -y * MODEL_UNITS_PER_CM,
      tandem: tandem.createTandem( 'waveStartPositionProperty' ),
      phetioDocumentation: 'the y-value of the 1st green dot measured with respect to the center line',
      units: 'cm',
      phetioValueType: NumberIO,
      range: new Range( -1.3, 1.3 )
    } );

    this.stepDtProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'stepDtProperty' )
    } );

    this.beta = 0.05;
    this.alpha = 1;

    this.reset();

    // set the string to 0 on mode changes
    this.waveModeProperty.lazyLink( () => {
      // Don't mess with phet-io, see https://github.com/phetsims/wave-on-a-string/issues/141
      if ( !isSettingPhetioStateProperty.value ) {
        this.manualRestart();
      }
    } );
  }

  /**
   * Steps forward in time.
   */
  public step( dt: number ): void {
    const fixDt = 1 / FRAMES_PER_SECOND;

    // limit changes dt
    const lastDt = this.lastDtProperty.value;
    if ( Math.abs( dt - lastDt ) > lastDt * 0.3 ) {
      dt = lastDt + ( ( dt - lastDt ) < 0 ? -1 : 1 ) * lastDt * 0.3;
    }
    this.lastDtProperty.value = dt;

    if ( this.isPlayingProperty.value ) {
      this.stepDtProperty.value += dt;

      // limit min dt
      if ( this.stepDtProperty.value >= fixDt ) {
        this.manualStep( this.stepDtProperty.value );
        this.stepDtProperty.value %= fixDt;
      }
    }
    this.nextLeftYProperty.value = this.yNow[ 0 ];
  }

  /**
   * This runs a fixed-timestep model step. Elsewhere we interpolate between these.
   */
  public evolve(): void {
    const dt = 1;
    const v = 1;
    const dx = dt * v;
    const b = this.dampingProperty.value * 0.002;

    this.beta = b * dt / 2;
    this.alpha = v * dt / dx;

    this.yNext[ 0 ] = this.yNow[ 0 ];

    switch( this.endTypeProperty.value ) {
      case WOASEndType.FIXED_END:
        this.yNow[ LAST_INDEX ] = 0;
        break;
      case WOASEndType.LOOSE_END:
        this.yNow[ LAST_INDEX ] = this.yNow[ NEXT_TO_LAST_INDEX ];
        break;
      case WOASEndType.NO_END:
        this.yNow[ LAST_INDEX ] = this.yLast[ NEXT_TO_LAST_INDEX ];
        break;
      default:
        throw new Error( `unknown end type: ${this.endTypeProperty.value}` );
    }

    // main formula for calculating
    const a = 1 / ( this.beta + 1 );
    const alphaSq = this.alpha * this.alpha;
    const c = 2 * ( 1 - alphaSq );
    for ( let i = 1; i < LAST_INDEX; i++ ) {
      this.yNext[ i ] = a * ( ( this.beta - 1 ) * this.yLast[ i ] + c * this.yNow[ i ] + alphaSq * ( this.yNow[ i + 1 ] + this.yNow[ i - 1 ] ) );
    }

    // store old values for the very last point
    const oldLast = this.yLast[ LAST_INDEX ];
    const oldNow = this.yNow[ LAST_INDEX ];
    const oldNext = this.yNext[ LAST_INDEX ];

    // rotate arrays instead of copying elements (for speed)
    const old = this.yLast;
    this.yLast = this.yNow;
    this.yNow = this.yNext;
    this.yNext = old;

    // restore the old values for the very last point for every array (potentially not needed for a few?)
    this.yLast[ LAST_INDEX ] = oldLast;
    this.yNow[ LAST_INDEX ] = oldNow;
    this.yNext[ LAST_INDEX ] = oldNext;

    switch( this.endTypeProperty.value ) {
      case WOASEndType.FIXED_END:
        this.yLast[ LAST_INDEX ] = 0;
        this.yNow[ LAST_INDEX ] = 0;
        break;
      case WOASEndType.LOOSE_END:
        this.yLast[ LAST_INDEX ] = this.yNow[ LAST_INDEX ];
        this.yNow[ LAST_INDEX ] = this.yNow[ NEXT_TO_LAST_INDEX ];
        break;
      case WOASEndType.NO_END:
        this.yLast[ LAST_INDEX ] = this.yNow[ LAST_INDEX ];
        this.yNow[ LAST_INDEX ] = this.yLast[ NEXT_TO_LAST_INDEX ]; // from a comment in the old model code?
        // from the Flash model: this.yNow[ LAST_INDEX ] = this.yNow[ LAST_INDEX ]; //this.yLast[ NEXT_TO_LAST_INDEX ];
        break;
      default:
        throw new Error( `unknown end type: ${this.endTypeProperty.value}` );
    }
  }

  /**
   * Manual step?
   */
  public manualStep( dt?: number ): void {
    let i;
    const fixDt = 1 / FRAMES_PER_SECOND;
    dt = ( dt !== undefined && dt > 0 ) ? dt : fixDt;

    const timeSpeed = this.timeSpeedProperty.value;
    assert && assert( timeSpeed === TimeSpeed.NORMAL || timeSpeed === TimeSpeed.SLOW, 'timeSpeedProperty has unsuported value' );

    const speedMultiplier = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? 1 : 0.25;

    // preparation to interpolate the yNow across individual evolve() steps to smooth the string on slow-FPS browsers
    const startingLeftY = this.yNow[ 0 ];
    const numSteps = Math.floor( dt / fixDt );
    const perStepDelta = numSteps ? ( ( this.nextLeftYProperty.value - startingLeftY ) / numSteps ) : 0;

    //dt for tension effect
    const tensionFactor = Utils.linear(
      Math.sqrt( 0.2 ), Math.sqrt( 0.8 ),
      0.2, 1,
      Math.sqrt( this.tensionProperty.value )
    );
    const minDt = ( 1 / ( FRAMES_PER_SECOND * tensionFactor * speedMultiplier ) );
    // limit max dt
    while ( dt >= fixDt ) {
      this.timeElapsedProperty.value = this.timeElapsedProperty.value + fixDt;
      this.stopwatch.step( fixDt * speedMultiplier );

      if ( this.waveModeProperty.value === WOASMode.OSCILLATE ) {
        this.angleProperty.value = ( this.angleProperty.value +
                                     Math.PI * 2 * this.frequencyProperty.value * fixDt * speedMultiplier ) % ( Math.PI * 2 );
        this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.value * MODEL_UNITS_PER_CM * Math.sin( -this.angleProperty.value );
      }
      if ( this.waveModeProperty.value === WOASMode.PULSE && this.pulsePendingProperty.value ) {
        this.pulsePendingProperty.value = false;
        this.pulseProperty.value = true;
        this.yNow[ 0 ] = 0;
      }
      if ( this.waveModeProperty.value === WOASMode.PULSE && this.pulseProperty.value ) {
        const da = Math.PI * fixDt * speedMultiplier / this.pulseWidthProperty.value;
        if ( this.angleProperty.value + da >= Math.PI / 2 ) {
          this.pulseSignProperty.value = -1;
        }
        if ( this.angleProperty.value + da * this.pulseSignProperty.value > 0 ) {
          this.angleProperty.value = this.angleProperty.value + da * this.pulseSignProperty.value;
        }
        else {
          //end pulse and reset
          this.angleProperty.reset();
          this.pulseSignProperty.reset();
          this.pulseProperty.reset();
        }
        this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.value * MODEL_UNITS_PER_CM * ( -this.angleProperty.value / ( Math.PI / 2 ) );
      }
      if ( this.waveModeProperty.value === WOASMode.MANUAL ) {
        // interpolate the yNow across steps for manual (between frames)
        this.yNow[ 0 ] += perStepDelta;
      }
      if ( this.timeElapsedProperty.value >= minDt ) {
        this.timeElapsedProperty.value = this.timeElapsedProperty.value % minDt;
        this.evolve();
        for ( i = 0; i < NUMBER_OF_BEADS; i++ ) {
          this.yDraw[ i ] = this.yLast[ i ];
        }
      }
      else {
        for ( i = 1; i < NUMBER_OF_BEADS; i++ ) {
          this.yDraw[ i ] = this.yLast[ i ] + ( ( this.yNow[ i ] - this.yLast[ i ] ) * ( this.timeElapsedProperty.value / minDt ) );
        }
      }
      dt -= fixDt;
    }
    if ( this.waveModeProperty.value === WOASMode.MANUAL ) {
      // sanity check for our yNow
      // this.yNow[0] = this.nextLeftYProperty.value;
    }
    this.yNowChangedEmitter.emit();
  }

  /**
   * Returns the y position for the end of the string (position for the ring).
   */
  public getRingY(): number {
    return this.yNow[ LAST_INDEX ] || 0;
  }

  /**
   * When we move to a fixed point, we want to zero out the very end.
   */
  public zeroOutEndPoint(): void {
    this.yNow[ LAST_INDEX ] = 0;
    this.yDraw[ LAST_INDEX ] = 0;

    this.yNowChangedEmitter.emit();
  }

  /**
   * Triggers the start of a pulse.
   */
  public manualPulse(): void {
    this.yNow[ 0 ] = 0;
    this.angleProperty.value = 0;
    this.pulseSignProperty.value = 1;
    this.pulsePendingProperty.value = true;
    this.pulseProperty.value = false;
  }

  /**
   * Triggers a reset (kind of a partial reset).
   */
  public manualRestart(): void {
    this.angleProperty.reset();
    this.timeElapsedProperty.reset();
    this.pulseProperty.reset();
    this.pulseSignProperty.reset();
    this.pulsePendingProperty.reset();

    for ( let i = 0; i < this.yNow.length; i++ ) {
      this.yDraw[ i ] = this.yNext[ i ] = this.yNow[ i ] = this.yLast[ i ] = 0;
    }

    this.nextLeftYProperty.value = 0;
    this.yNowChangedEmitter.emit();
  }

  /**
   * Resets everything in the model.
   */
  public reset(): void {
    this.waveModeProperty.reset();
    this.endTypeProperty.reset();
    this.timeSpeedProperty.reset();
    this.rulersVisibleProperty.reset();
    this.referenceLineVisibleProperty.reset();
    this.tensionProperty.reset();
    this.dampingProperty.reset();
    this.frequencyProperty.reset();
    this.pulseWidthProperty.reset();
    this.amplitudeProperty.reset();
    this.isPlayingProperty.reset();
    this.lastDtProperty.reset();
    this.horizontalRulerPositionProperty.reset();
    this.verticalRulerPositionProperty.reset();
    this.referenceLinePositionProperty.reset();
    this.stopwatch.reset();
    this.wrenchArrowsVisibleProperty.reset();
    this.manualRestart();
  }

  public static WOASModelIO = new IOType( 'WOASModelIO', {
    valueType: WOASModel,
    documentation: 'The main model for Wave on a String',
    toStateObject: ( model: WOASModel ) => ( {
      _yDraw: Float64ArrayIO.toStateObject( model.yDraw ),
      _yNow: Float64ArrayIO.toStateObject( model.yNow ),
      _yLast: Float64ArrayIO.toStateObject( model.yLast ),
      _yNext: Float64ArrayIO.toStateObject( model.yNext )
    } ),
    stateSchema: {
      _yDraw: Float64ArrayIO,
      _yNow: Float64ArrayIO,
      _yLast: Float64ArrayIO,
      _yNext: Float64ArrayIO
    },
    applyState: ( model: WOASModel, stateObject ) => {

      // We make an assumption about Float64ArrayIO's serialization here, so that we don't create temporary garbage
      // Float64Arrays. Instead we set the array values directly.
      model.yDraw.set( stateObject._yDraw );
      model.yNow.set( stateObject._yNow );
      model.yLast.set( stateObject._yLast );
      model.yNext.set( stateObject._yNext );

      model.yNowChangedEmitter.emit();
    }
  } );
}

waveOnAString.register( 'WOASModel', WOASModel );