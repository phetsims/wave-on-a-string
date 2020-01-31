// Copyright 2013-2020, University of Colorado Boulder

/**
 * Model object for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Stopwatch = require( 'SCENERY_PHET/Stopwatch' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // constants
  const NUMBER_OF_SEGMENTS = 61;
  const LAST_INDEX = NUMBER_OF_SEGMENTS - 1;
  const NEXT_TO_LAST_INDEX = NUMBER_OF_SEGMENTS - 2;
  const AMPLITUDE_MULTIPLIER = 80;
  const FRAMES_PER_SECOND = 50;

  class WOASModel {
    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      // @public {Float64Array}
      this.yDraw = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yNow = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yLast = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yNext = new Float64Array( NUMBER_OF_SEGMENTS );

      // @public {Property.<WOASModel.Mode>}
      this.modeProperty = new EnumerationProperty( WOASModel.Mode, WOASModel.Mode.MANUAL, {
        tandem: tandem.createTandem( 'modeProperty' )
      } );

      // @public {Property.<WOASModel.EndType}
      this.endTypeProperty = new EnumerationProperty( WOASModel.EndType, WOASModel.EndType.FIXED_END, {
        tandem: tandem.createTandem( 'endTypeProperty' )
      } );

      // @public {Property.<boolean>}
      this.isPlayingProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'isPlayingProperty' )
      } );

      // @public {Property.<number>} - Speed multiplier
      this.speedProperty = new NumberProperty( 1, {
        phetioStudioControl: false,
        tandem: tandem.createTandem( 'speedProperty' )
      } );

      // @public {Property.<boolean>} - Visibilities
      this.rulersVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'rulersVisibleProperty' )
      } );
      this.stopwatchVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'stopwatchVisibleProperty' )
      } );
      this.referenceLineVisibleProperty = new BooleanProperty( false, {
        tandem: tandem.createTandem( 'referenceLineVisibleProperty' )
      } );
      this.wrenchArrowsVisibleProperty = new BooleanProperty( true, {
        tandem: tandem.createTandem( 'wrenchArrowsVisibleProperty' )
      } );

      // @public {Property.<Vector2>}
      this.horizontalRulerPositionProperty = new Vector2Property( new Vector2( 54, 117 ), {
        tandem: tandem.createTandem( 'horizontalRulerPositionProperty' )
      } );
      this.verticalRulerPositionProperty = new Vector2Property( new Vector2( 13, 440 ), {
        tandem: tandem.createTandem( 'verticalRulerPositionProperty' )
      } );
      this.referenceLinePositionProperty = new Vector2Property( new Vector2( -10, 120 ), {
        tandem: tandem.createTandem( 'referenceLinePositionProperty' )
      } );

      // @public {Property.<number>}
      this.tensionProperty = new NumberProperty( 2, {
        range: new Range( 0, 2 ),
        tandem: tandem.createTandem( 'tensionProperty' )
      } );

      // @public {Property.<number>}
      this.dampingProperty = new NumberProperty( 20, {
        range: new Range( 0, 100 ),
        tandem: tandem.createTandem( 'dampingProperty' )
      } );

      // @public {Property.<number>}
      this.frequencyProperty = new NumberProperty( 1.50, {
        range: new Range( 0, 3 ),
        tandem: tandem.createTandem( 'frequencyProperty' )
      } );

      // @public {Property.<number>}
      this.pulseWidthProperty = new NumberProperty( 0.5, {
        range: new Range( 0, 1 ),
        tandem: tandem.createTandem( 'pulseWidthProperty' )
      } );

      // @public {Property.<number>}
      this.amplitudeProperty = new NumberProperty( 0.75, {
        range: new Range( 0, 1.5 ),
        tandem: tandem.createTandem( 'amplitudeProperty' )
      } );

      // @public {Property.<number>}
      this.lastDtProperty = new NumberProperty( 0.03, {
        phetioReadOnly: true,
        tandem: tandem.createTandem( 'lastDtProperty' )
      } );

      // @public {Property.<number>} - Base time??
      this.timeProperty = new NumberProperty( 0, {
        phetioReadOnly: true,
        tandem: tandem.createTandem( 'timeProperty' )
      } );

      // @public {Property.<number>} - Angle for OSCILLATE/PULSE mode, in radians
      this.angleProperty = new NumberProperty( 0, {
        phetioReadOnly: true,
        range: new Range( 0, 2 * Math.PI ),
        tandem: tandem.createTandem( 'angleProperty' )
      } );

      // @public {Property.<boolean>} - Whether a pulse will start at the next proper model step
      this.pulsePendingProperty = new BooleanProperty( false, {
        phetioReadOnly: true,
        tandem: tandem.createTandem( 'pulsePendingProperty' )
      } );

      // @public {Property.<number>} - for pulse mode
      this.pulseSignProperty = new NumberProperty( 1, {
        phetioReadOnly: true,
        validValues: [ -1, 1 ],
        tandem: tandem.createTandem( 'pulseSignProperty' )
      } );

      // @public {Property.<boolean>} - Whether a pulse is currently active
      this.pulseProperty = new BooleanProperty( false, {
        phetioReadOnly: true,
        tandem: tandem.createTandem( 'pulseProperty' )
      } );

      // @public {Stopwatch}
      this.stopwatch = new Stopwatch( {
        position: new Vector2( 550, 330 ),
        tandem: tandem.createTandem( 'stopwatch' )
      } );

      // @public {Emitter} - Events emitted by instances of this type
      this.yNowChangedEmitter = new Emitter();

      // @public {number} - used to interpolate the left-most y value of the string while the wrench is moved in manual
      // mode, for low-FPS browsers
      this.nextLeftYProperty = new NumberProperty( 0, {
        phetioReadOnly: true,
        tandem: tandem.createTandem( 'nextLeftYProperty' )
      } );

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
      this.modeProperty.lazyLink( () => this.manualRestart() );
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

      switch ( this.endTypeProperty.value ) {
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

      switch ( this.endTypeProperty.value ) {
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

      // preparation to interpolate the yNow across individual evolve() steps to smooth the string on slow-FPS browsers
      const startingLeftY = this.yNow[ 0 ];
      const numSteps = Math.floor( dt / fixDt );
      const perStepDelta = numSteps ? ( ( this.nextLeftYProperty.value - startingLeftY ) / numSteps ) : 0;

      //dt for tension effect
      const minDt = ( 1 / ( FRAMES_PER_SECOND * ( 0.2 + this.tensionProperty.value * 0.4 ) * this.speedProperty.value ) );
      // limit max dt
      while ( dt >= fixDt ) {
        this.timeProperty.value = this.timeProperty.value + fixDt;
        this.stopwatch.step( fixDt * this.speedProperty.value );

        if ( this.modeProperty.value === WOASModel.Mode.OSCILLATE ) {
          this.angleProperty.value = this.angleProperty.value +
                                     Math.PI * 2 * this.frequencyProperty.value * fixDt * this.speedProperty.value ;
          this.angleProperty.value = this.angleProperty.value % ( Math.PI * 2 );
          this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.value * AMPLITUDE_MULTIPLIER * Math.sin( -this.angleProperty.value );
        }
        if ( this.modeProperty.value === WOASModel.Mode.PULSE && this.pulsePendingProperty.value ) {
          this.pulsePendingProperty.value = false;
          this.pulseProperty.value = true;
          this.yNow[ 0 ] = 0;
        }
        if ( this.modeProperty.value === WOASModel.Mode.PULSE && this.pulseProperty.value ) {
          const da = Math.PI * fixDt * this.speedProperty.value / this.pulseWidthProperty.value;
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
        if ( this.modeProperty.value === WOASModel.Mode.MANUAL ) {
          // interpolate the yNow across steps for manual (between frames)
          this.yNow[ 0 ] += perStepDelta;
        }
        if ( this.timeProperty.value >= minDt ) {
          this.timeProperty.value = this.timeProperty.value % minDt;
          this.evolve();
          for ( i = 0; i < NUMBER_OF_SEGMENTS; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ];
          }
        }
        else {
          for ( i = 1; i < NUMBER_OF_SEGMENTS; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ] + ( ( this.yNow[ i ] - this.yLast[ i ] ) * ( this.timeProperty.value / minDt ) );
          }
        }
        dt -= fixDt;
      }
      if ( this.modeProperty.value === WOASModel.Mode.MANUAL ) {
        // sanity check for our yNow
        // this.yNow[0] = this.nextLeftYProperty.value;
      }
      this.yNowChangedEmitter.emit();
    }

    /**
     * Returns the y position for the end of the string (location for the ring).
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
      this.timeProperty.reset();
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
      this.modeProperty.reset();
      this.endTypeProperty.reset();
      this.speedProperty.reset();
      this.rulersVisibleProperty.reset();
      this.stopwatchVisibleProperty.reset();
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

  return waveOnAString.register( 'WOASModel', WOASModel );
} );
