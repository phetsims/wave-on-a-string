// Copyright 2013-2021, University of Colorado Boulder

/**
 * Model object for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Stopwatch from '../../../../scenery-phet/js/Stopwatch.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Float64ArrayIO from '../../../../tandem/js/types/Float64ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import waveOnAString from '../../waveOnAString.js';

// constants
const NUMBER_OF_SEGMENTS = 61;
const LAST_INDEX = NUMBER_OF_SEGMENTS - 1;
const NEXT_TO_LAST_INDEX = NUMBER_OF_SEGMENTS - 2;
const AMPLITUDE_MULTIPLIER = 80; // the number of model units (vertically) per cm
const FRAMES_PER_SECOND = 50;

class WOASModel extends PhetioObject {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( {
      tandem: tandem,
      phetioType: WOASModel.WOASModelIO
    } );

    // @public {Float64Array}
    this.yDraw = new Float64Array( NUMBER_OF_SEGMENTS );
    this.yNow = new Float64Array( NUMBER_OF_SEGMENTS );
    this.yLast = new Float64Array( NUMBER_OF_SEGMENTS );
    this.yNext = new Float64Array( NUMBER_OF_SEGMENTS );

    // @public {Property.<WOASModel.Mode>}
    this.waveModeProperty = new EnumerationProperty( WOASModel.Mode, WOASModel.Mode.MANUAL, {
      tandem: tandem.createTandem( 'waveModeProperty' ),
      phetioDocumentation: 'what is on the left side of the string, controlling its motion'
    } );

    // @public {Property.<WOASModel.EndType}
    this.endTypeProperty = new EnumerationProperty( WOASModel.EndType, WOASModel.EndType.FIXED_END, {
      tandem: tandem.createTandem( 'endTypeProperty' ),
      phetioDocumentation: 'what is on the right side of the string'
    } );

    // @public {Property.<boolean>}
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioDocumentation: 'whether time is moving forward in the simulation (paused if false)'
    } );

    // @public {Property.<TimeSpeed>}
    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed, TimeSpeed.NORMAL, {
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioDocumentation: 'the play speed for the simulation as it moves through time'
    } );

    // @public {Property.<boolean>} - Visibilities
    this.rulersVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'rulersVisibleProperty' ),
      phetioDocumentation: 'whether the rulers are visible'
    } );
    this.referenceLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'referenceLineVisibleProperty' ),
      phetioDocumentation: 'whether the reference line is visible'
    } );
    this.wrenchArrowsVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'wrenchArrowsVisibleProperty' ),
      phetioDocumentation: 'whether the up/down arrows on the wrench are visible'
    } );

    // @public {Property.<Vector2>}
    this.horizontalRulerPositionProperty = new Vector2Property( new Vector2( 54, 117 ), {
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

    // @public {Property.<number>}
    this.tensionProperty = new NumberProperty( 0.8, {
      range: new Range( 0.2, 0.8 ),
      tandem: tandem.createTandem( 'tensionProperty' ),
      phetioDocumentation: 'the relative amount of tension on the string'
    } );

    // @public {Property.<number>}
    this.dampingProperty = new NumberProperty( 20, {
      range: new Range( 0, 100 ),
      tandem: tandem.createTandem( 'dampingProperty' ),
      phetioDocumentation: 'the relative amount of damping (percentage) for the string'
    } );

    // @public {Property.<number>}
    this.frequencyProperty = new NumberProperty( 1.50, {
      range: new Range( 0, 3 ),
      tandem: tandem.createTandem( 'frequencyProperty' ),
      phetioDocumentation: 'the frequency of the oscillator, in hertz',
      units: 'Hz'
    } );

    // @public {Property.<number>}
    this.pulseWidthProperty = new NumberProperty( 0.5, {
      range: new Range( 0.2, 1 ),
      tandem: tandem.createTandem( 'pulseWidthProperty' ),
      phetioDocumentation: 'the width of a pulse (generated with the pulse mode) in seconds',
      units: 's'
    } );

    // @public {Property.<number>}
    this.amplitudeProperty = new NumberProperty( 0.75, {
      range: new Range( 0, 1.3 ),
      tandem: tandem.createTandem( 'amplitudeProperty' ),
      phetioDocumentation: 'the amplitude of the oscillation or pulses in centimeters',
      units: 'cm'
    } );

    // @public {Property.<number>}
    this.lastDtProperty = new NumberProperty( 0.03, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'lastDtProperty' ),
      phetioDocumentation: 'the amount of time since the last manual internal step, in seconds'
    } );

    // @public {Property.<number>}
    this.timeElapsedProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'timeElapsedProperty' ),
      phetioDocumentation: 'the amount of time elapsed since the last evolution of the physics model, in seconds'
    } );

    // @public {Property.<number>}
    this.angleProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      range: new Range( 0, 2 * Math.PI ),
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioDocumentation: 'the angle (in radians) of the oscillator or pulse',
      units: 'radians'
    } );

    // @public {Property.<boolean>}
    this.pulsePendingProperty = new BooleanProperty( false, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'pulsePendingProperty' ),
      phetioDocumentation: 'whether a pulse will start at the next internal model step'
    } );

    // @public {Property.<number>}
    this.pulseSignProperty = new NumberProperty( 1, {
      phetioReadOnly: true,
      validValues: [ -1, 1 ],
      tandem: tandem.createTandem( 'pulseSignProperty' ),
      phetioDocumentation: 'which part of the pulse is being generated'
    } );

    // @public {Property.<boolean>}
    this.pulseProperty = new BooleanProperty( false, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'pulseProperty' ),
      phetioDocumentation: 'whether a pulse is currently active'
    } );

    // @public {Stopwatch}
    this.stopwatch = new Stopwatch( {
      position: new Vector2( 550, 330 ),
      tandem: tandem.createTandem( 'stopwatch' ),
      timePropertyOptions: {
        range: Stopwatch.ZERO_TO_ALMOST_SIXTY
      }
    } );

    // @public {Emitter} - Events emitted by instances of this type
    this.yNowChangedEmitter = new Emitter();

    // @public {Property.<number>}
    this.nextLeftYProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'nextLeftYProperty' ),
      phetioDocumentation: 'internal property used to interpolate the left-most y value of the string while the wrench is moved in manual mode - for low-fps browsers'
    } );

    // @public {Property.<number>}
    this.waveStartPositionProperty = new DynamicProperty( new Property( this.nextLeftYProperty ), {
      bidirectional: true,
      map: y => -y / AMPLITUDE_MULTIPLIER,
      inverseMap: y => -y * AMPLITUDE_MULTIPLIER,
      tandem: tandem.createTandem( 'waveStartPositionProperty' ),
      phetioDocumentation: 'the y-value of the 1st green dot measured with respect to the center line',
      units: 'cm',
      phetioType: Property.PropertyIO( NumberIO )
    } );
    // TODO: how to support range on dynamic properties?
    this.waveStartPositionProperty.range = new Range( -1.3, 1.3 );

    // @private {Property.<number>}
    this.stepDtProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'stepDtProperty' )
    } );

    // @private {number}
    this.beta = 0.05;
    this.alpha = 1;

    this.reset();

    // set the string to 0 on mode changes
    this.waveModeProperty.lazyLink( () => {
      // Don't mess with phet-io, see https://github.com/phetsims/wave-on-a-string/issues/141
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.manualRestart();
      }
    } );
  }

  /**
   * Steps forward in time.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
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
   * @public
   */
  evolve() {
    const dt = 1;
    const v = 1;
    const dx = dt * v;
    const b = this.dampingProperty.value * 0.002;

    this.beta = b * dt / 2;
    this.alpha = v * dt / dx;

    this.yNext[ 0 ] = this.yNow[ 0 ];

    switch( this.endTypeProperty.value ) {
      case WOASModel.EndType.FIXED_END:
        this.yNow[ LAST_INDEX ] = 0;
        break;
      case WOASModel.EndType.LOOSE_END:
        this.yNow[ LAST_INDEX ] = this.yNow[ NEXT_TO_LAST_INDEX ];
        break;
      case WOASModel.EndType.NO_END:
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
      case WOASModel.EndType.FIXED_END:
        this.yLast[ LAST_INDEX ] = 0;
        this.yNow[ LAST_INDEX ] = 0;
        break;
      case WOASModel.EndType.LOOSE_END:
        this.yLast[ LAST_INDEX ] = this.yNow[ LAST_INDEX ];
        this.yNow[ LAST_INDEX ] = this.yNow[ NEXT_TO_LAST_INDEX ];
        break;
      case WOASModel.EndType.NO_END:
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
   * @public
   *
   * @param {number} dt
   */
  manualStep( dt ) {
    let i;
    const fixDt = 1 / FRAMES_PER_SECOND;
    dt = ( dt !== undefined && dt > 0 ) ? dt : fixDt;

    const speedMultiplier = this.timeSpeedProperty.value === TimeSpeed.NORMAL ? 1 :
                            this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.25 :
                            null;
    assert && assert( speedMultiplier !== null, 'timeSpeedProperty has unsuported value' );

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

      if ( this.waveModeProperty.value === WOASModel.Mode.OSCILLATE ) {
        this.angleProperty.value = ( this.angleProperty.value +
                                     Math.PI * 2 * this.frequencyProperty.value * fixDt * speedMultiplier ) % ( Math.PI * 2 );
        this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.value * AMPLITUDE_MULTIPLIER * Math.sin( -this.angleProperty.value );
      }
      if ( this.waveModeProperty.value === WOASModel.Mode.PULSE && this.pulsePendingProperty.value ) {
        this.pulsePendingProperty.value = false;
        this.pulseProperty.value = true;
        this.yNow[ 0 ] = 0;
      }
      if ( this.waveModeProperty.value === WOASModel.Mode.PULSE && this.pulseProperty.value ) {
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
        this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.value * AMPLITUDE_MULTIPLIER * ( -this.angleProperty.value / ( Math.PI / 2 ) );
      }
      if ( this.waveModeProperty.value === WOASModel.Mode.MANUAL ) {
        // interpolate the yNow across steps for manual (between frames)
        this.yNow[ 0 ] += perStepDelta;
      }
      if ( this.timeElapsedProperty.value >= minDt ) {
        this.timeElapsedProperty.value = this.timeElapsedProperty.value % minDt;
        this.evolve();
        for ( i = 0; i < NUMBER_OF_SEGMENTS; i++ ) {
          this.yDraw[ i ] = this.yLast[ i ];
        }
      }
      else {
        for ( i = 1; i < NUMBER_OF_SEGMENTS; i++ ) {
          this.yDraw[ i ] = this.yLast[ i ] + ( ( this.yNow[ i ] - this.yLast[ i ] ) * ( this.timeElapsedProperty.value / minDt ) );
        }
      }
      dt -= fixDt;
    }
    if ( this.waveModeProperty.value === WOASModel.Mode.MANUAL ) {
      // sanity check for our yNow
      // this.yNow[0] = this.nextLeftYProperty.value;
    }
    this.yNowChangedEmitter.emit();
  }

  /**
   * Returns the y position for the end of the string (position for the ring).
   * @public
   *
   * @returns {number}
   */
  getRingY() {
    return this.yNow[ LAST_INDEX ] || 0;
  }

  /**
   * When we move to a fixed point, we want to zero out the very end.
   * @public
   */
  zeroOutEndPoint() {
    this.yNow[ LAST_INDEX ] = 0;
    this.yDraw[ LAST_INDEX ] = 0;

    this.yNowChangedEmitter.emit();
  }

  /**
   * Triggers the start of a pulse.
   * @public
   */
  manualPulse() {
    this.yNow[ 0 ] = 0;
    this.angleProperty.value = 0;
    this.pulseSignProperty.value = 1;
    this.pulsePendingProperty.value = true;
    this.pulseProperty.value = false;
  }

  /**
   * Triggers a reset (kind of a partial reset).
   * @public
   */
  manualRestart() {
    this.angleProperty.reset();
    this.timeElapsedProperty.reset();
    this.pulseProperty.reset();
    this.pulseSignProperty.reset();
    this.pulsePendingProperty.reset();
    this.customDt = 0;

    for ( let i = 0; i < this.yNow.length; i++ ) {
      this.yDraw[ i ] = this.yNext[ i ] = this.yNow[ i ] = this.yLast[ i ] = 0;
    }

    this.nextLeftYProperty.value = 0;
    this.yNowChangedEmitter.emit();
  }

  /**
   * Resets everything in the model.
   * @public
   */
  reset() {
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
}

// @public {Enumeration}
WOASModel.Mode = Enumeration.byKeys( [
  'MANUAL',
  'OSCILLATE',
  'PULSE'
] );

// @public {Enumeration}
WOASModel.EndType = Enumeration.byKeys( [
  'FIXED_END',
  'LOOSE_END',
  'NO_END'
] );

WOASModel.WOASModelIO = new IOType( 'WOASModelIO', {
  valueType: WOASModel,
  documentation: 'The main model for Wave on a String',
  toStateObject: model => ( {
    private: {
      yDraw: Float64ArrayIO.toStateObject( model.yDraw ),
      yNow: Float64ArrayIO.toStateObject( model.yNow ),
      yLast: Float64ArrayIO.toStateObject( model.yLast ),
      yNext: Float64ArrayIO.toStateObject( model.yNext )
    }
  } ),
  stateSchema: {
    private: {
      yDraw: Float64ArrayIO,
      yNow: Float64ArrayIO,
      yLast: Float64ArrayIO,
      yNext: Float64ArrayIO
    }
  },
  applyState: ( model, stateObject ) => {

    // We make an assumption about Float64ArrayIO's serialization here, so that we don't create temporary garbage
    // Float64Arrays. Instead we set the array values directly.
    model.yDraw.set( stateObject.private.yDraw );
    model.yNow.set( stateObject.private.yNow );
    model.yLast.set( stateObject.private.yLast );
    model.yNext.set( stateObject.private.yNext );

    model.yNowChangedEmitter.emit();
  }
} );

waveOnAString.register( 'WOASModel', WOASModel );
export default WOASModel;
