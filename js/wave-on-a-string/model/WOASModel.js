// Copyright 2013-2019, University of Colorado Boulder

/**
 * Model object for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Emitter = require( 'AXON/Emitter' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
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
    constructor() {
      // @private {number}
      this.stepDt = 0;

      this.yDraw = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yNow = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yLast = new Float64Array( NUMBER_OF_SEGMENTS );
      this.yNext = new Float64Array( NUMBER_OF_SEGMENTS );

      // @public {Property.<WOASModel.Mode>}
      this.modeProperty = new EnumerationProperty( WOASModel.Mode, WOASModel.Mode.MANUAL );

      // @public {Property.<WOASModel.EndType}
      this.endTypeProperty = new EnumerationProperty( WOASModel.EndType, WOASModel.EndType.FIXED_END );

      // @public {Property.<number>} - Speed multiplier
      this.speedProperty = new NumberProperty( 1 );

      this.rulersProperty = new Property( false ); // visible rulers
      this.timerProperty = new Property( false );  // visible timer
      this.referenceLineProperty = new Property( false ); // visible referenceLine
      this.tensionProperty = new Property( 2 ); // tension 0..2
      this.dampingProperty = new Property( 20 ); // dumping 0..100
      this.frequencyProperty = new Property( 1.50 ); // frequency 0.00 .. 3.00
      this.pulseWidthProperty = new Property( 0.5 ); // pulse width 0.00 .. 1.00
      this.amplitudeProperty = new Property( 0.75 ); // amplitude 0.0 .. 1.5
      this.playProperty = new Property( true ); // play/pause state
      this.lastDtProperty = new Property( 0.03 );
      this.timeProperty = new Property( 0 ); // base time
      this.angleProperty = new Property( 0 ); // angle for OSCILLATE/PULSE mode
      this.pulsePendingProperty = new Property( false ); // whether a pulse will start at the next proper model step
      this.pulseProperty = new Property( false ); // 'pulse' mode pulse active
      this.rulerLocHProperty = new Vector2Property( new Vector2( 54, 117 ) ); //position horizontal ruler
      this.rulerLocVProperty = new Vector2Property( new Vector2( 13, 440 ) ); //position vertical ruler
      this.referenceLineLocProperty = new Vector2Property( new Vector2( -10, 120 ) ); // position referenceLine
      this.stopwatch = new Stopwatch( {
        position: new Vector2( 550, 330 ) // position timer
      } );
      this.pulseSignProperty = new Property( 1 ); // sign [-1, 1] for pulse mode
      this.wrenchArrowsVisibleProperty = new Property( true );

      // @public - events emitted by instances of this type
      this.yNowChanged = new Emitter();

      this.nextLeftY = 0; // used to interpolate the left-most y value of the string while the wrench is moved in manual mode, for low-FPS browsers
      this.nSegs = NUMBER_OF_SEGMENTS;
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
      if ( Math.abs( dt - this.lastDtProperty.get() ) > this.lastDtProperty.get() * 0.3 ) {
        dt = this.lastDtProperty.get() + ( ( dt - this.lastDtProperty.get() ) < 0 ? -1 : 1 ) * this.lastDtProperty.get() * 0.3;
      }
      this.lastDtProperty.set( dt );

      if ( this.playProperty.get() ) {
        this.stepDt += dt;
        //limit min dt
        if ( this.stepDt >= fixDt ) {
          this.manualStep( this.stepDt );
          this.stepDt %= fixDt;
        }
      }
      this.nextLeftY = this.yNow[ 0 ];
    }

    // NOTE TO FUTURE MAINTAINER: this is the fixed-timestep model step. We interpolate between these steps as needed
    evolve() {
      const dt = 1;
      const v = 1;
      const dx = dt * v;
      const b = this.dampingProperty.get() * 0.002;
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

      //main formula for calculating
      const a = 1 / ( this.beta + 1 );
      const alphaSq = this.alpha * this.alpha;
      const c = 2 * ( 1 - alphaSq );
      for ( let i = 1; i < ( this.nSegs - 1 ); i++ ) {
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

    manualStep( dt ) {
      let i;
      const fixDt = 1 / FRAMES_PER_SECOND;
      dt = ( dt !== undefined && dt > 0 ) ? dt : fixDt;

      // preparation to interpolate the yNow across individual evolve() steps to smooth the string on slow-FPS browsers
      const startingLeftY = this.yNow[ 0 ];
      const numSteps = Math.floor( dt / fixDt );
      const perStepDelta = numSteps ? ( ( this.nextLeftY - startingLeftY ) / numSteps ) : 0;

      //dt for tension effect
      const minDt = ( 1 / ( FRAMES_PER_SECOND * ( 0.2 + this.tensionProperty.get() * 0.4 ) * this.speedProperty.value ) );
      // limit max dt
      while ( dt >= fixDt ) {
        this.timeProperty.set( this.timeProperty.get() + fixDt );
        this.stopwatch.step( fixDt * this.speedProperty.value );

        if ( this.modeProperty.value === WOASModel.Mode.OSCILLATE ) {
          this.angleProperty.set( this.angleProperty.get() +
                                  Math.PI * 2 * this.frequencyProperty.get() * fixDt * this.speedProperty.value );
          this.angleProperty.set( this.angleProperty.get() % ( Math.PI * 2 ) );
          this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.get() * AMPLITUDE_MULTIPLIER * Math.sin( -this.angleProperty.get() );
        }
        if ( this.modeProperty.get() === WOASModel.Mode.PULSE && this.pulsePendingProperty.get() ) {
          this.pulsePendingProperty.set( false );
          this.pulseProperty.set( true );
          this.yNow[ 0 ] = 0;
        }
        if ( this.modeProperty.get() === WOASModel.Mode.PULSE && this.pulseProperty.get() ) {
          const da = Math.PI * fixDt * this.speedProperty.value / this.pulseWidthProperty.get();
          if ( this.angleProperty.get() + da >= Math.PI / 2 ) {
            this.pulseSignProperty.set( -1 );
          }
          if ( this.angleProperty.get() + da * this.pulseSignProperty.get() > 0 ) {
            this.angleProperty.set( this.angleProperty.get() + da * this.pulseSignProperty.get() );
          }
          else {
            //end pulse and reset
            this.angleProperty.reset();
            this.pulseSignProperty.reset();
            this.pulseProperty.reset();
          }
          this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.get() * AMPLITUDE_MULTIPLIER * ( -this.angleProperty.get() / ( Math.PI / 2 ) );
        }
        if ( this.modeProperty.get() === WOASModel.Mode.MANUAL ) {
          // interpolate the yNow across steps for manual (between frames)
          this.yNow[ 0 ] += perStepDelta;
        }
        if ( this.timeProperty.get() >= minDt ) {
          this.timeProperty.set( this.timeProperty.get() % minDt );
          this.evolve();
          for ( i = 0; i < NUMBER_OF_SEGMENTS; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ];
          }
        }
        else {
          for ( i = 1; i < NUMBER_OF_SEGMENTS; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ] + ( ( this.yNow[ i ] - this.yLast[ i ] ) * ( this.timeProperty.get() / minDt ) );
          }
        }
        dt -= fixDt;
      }
      if ( this.modeProperty.get() === WOASModel.Mode.MANUAL ) {
        // sanity check for our yNow
        // this.yNow[0] = this.nextLeftY;
      }
      this.yNowChanged.emit();
    }

    zeroOutEndPoint() {
      // when moving to fixed, zero out the very end point
      this.yNow[ LAST_INDEX ] = 0;
      this.yDraw[ LAST_INDEX ] = 0;

      this.yNowChanged.emit();
    }

    //restart button
    manualRestart() {
      //only soft reset
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      this.pulseSignProperty.reset();
      this.pulsePendingProperty.reset();
      this.customDt = 0;
      for ( let i = 0; i < this.yNow.length; i++ ) {
        this.yDraw[ i ] = this.yNext[ i ] = this.yNow[ i ] = this.yLast[ i ] = 0;
      }
      this.nextLeftY = 0;
      this.yNowChanged.emit();
    }

    //pulse button
    manualPulse() {
      this.yNow[ 0 ] = 0;
      this.angleProperty.set( 0 );
      this.pulseSignProperty.set( 1 );
      this.pulsePendingProperty.set( true );
      this.pulseProperty.set( false );
    }

    // all reset button
    reset() {
      this.modeProperty.reset();
      this.endTypeProperty.reset();
      this.speedProperty.reset();
      this.rulersProperty.reset();
      this.timerProperty.reset();
      this.referenceLineProperty.reset();
      this.tensionProperty.reset();
      this.dampingProperty.reset();
      this.frequencyProperty.reset();
      this.pulseWidthProperty.reset();
      this.amplitudeProperty.reset();
      this.playProperty.reset();
      this.lastDtProperty.reset();
      this.timeProperty.reset();
      this.angleProperty.reset();
      this.pulsePendingProperty.reset();
      this.pulseProperty.reset();
      this.rulerLocHProperty.reset();
      this.rulerLocVProperty.reset();
      this.referenceLineLocProperty.reset();
      this.stopwatch.reset();
      this.pulseSignProperty.reset();
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
