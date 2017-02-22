// Copyright 2013-2015, University of Colorado Boulder

/**
 * main Model container.
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  var NSEGS = 61;
  var fps = 50;

  function WOASModel() {

    var self = this;

    self.nexusOrienation = 0;

    // HACK ALERT!
    // Testing the nexus!
    // http://169.254.86.49:9081/
    var websocket = new WebSocket('ws://localhost:9081/bindModel/nexus.sensors/orientation');
           websocket.onmessage = function (evt) {
               var inputs = JSON.parse(evt.data);

               var orientation = -inputs.betaAbs * 2;

               // further transformation will occur here
               orientation = Util.clamp( orientation, -100, 100 );

               self.nexusOrienation = orientation;
              //  console.log( orientation );
               self.nextLeftY = orientation;
               self.play = true;
               this.trigger( 'yNowChanged' );

           };


    this.stepDt = 0;
    var Array = window.Float64Array || window.Array;

    this.yDraw = new Array( NSEGS );
    this.yNow = new Array( NSEGS );
    this.yLast = new Array( NSEGS );
    this.yNext = new Array( NSEGS );
    this.dotPerCm = 80;

    this.modeProperty = new Property( 'manual' ); // 'manual', 'oscillate', 'pulse'
    this.typeEndProperty = new Property( 'fixedEnd' ); // 'fixedEnd', 'looseEnd', 'noEnd'
    this.speedProperty = new Property( 1 ); // 1, 0.25
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
    this.angleProperty = new Property( 0 ); // angle for 'oscillate' and 'pulse' mode
    this.pulsePendingProperty = new Property( false ); // whether a pulse will start at the next proper model step
    this.pulseProperty = new Property( false ); // 'pulse' mode pulse active
    this.rulerLocHProperty = new Property( new Vector2( 54, 117 ) ); //position horizontal ruler
    this.rulerLocVProperty = new Property( new Vector2( 13, 440 ) ); //position vertical ruler
    this.referenceLineLocProperty = new Property ( new Vector2( -10, 120 ) ); // position referenceLine
    this.timerStartProperty = new Property( false ); // timer start/pause status
    this.timerSecondProperty = new Property( 0 ); // timer time in seconds
    this.timerLocProperty =  new Property( new Vector2( 550, 330 ) ); // position timer
    this.pulseSignProperty = new Property( 1 ); // sign [-1, 1] for pulse mode
    this.wrenchArrowsVisibleProperty = new Property( true );

    // @public - events emitted by instances of this type
    this.yNowChanged = new Emitter();

    this.nextLeftY = 0; // used to interpolate the left-most y value of the string while the wrench is moved in manual mode, for low-FPS browsers
    this.nSegs = NSEGS;
    this.beta = 0.05;
    this.alpha = 1;
    this.reset();

    // set the string to 0 on mode changes
    this.modeProperty.lazyLink( this.manualRestart.bind( this ) );
  }

  inherit( Object, WOASModel, {
    step: function( dt ) {
      var fixDt = 1 / fps;
      // limit changes dt
      if ( Math.abs( dt - this.lastDtProperty.get() ) > this.lastDtProperty.get() * 0.3 ) {
        dt = this.lastDtProperty.get() + (( dt - this.lastDtProperty.get() ) < 0 ? -1 : 1) * this.lastDtProperty.get() * 0.3;
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
    },
    // all reset button
    reset: function() {
      this.modeProperty.reset();
      this.typeEndProperty.reset();
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
      this.timerStartProperty.reset();
      this.timerSecondProperty.reset();
      this.timerLocProperty.reset();
      this.pulseSignProperty.reset();
      this.wrenchArrowsVisibleProperty.reset();
      this.manualRestart();
    },
    // NOTE TO FUTURE MAINTAINER: this is the fixed-timestep model step. We interpolate between these steps as needed
    evolve: function() {
      var dt = 1;
      var v = 1;
      var dx = dt * v;
      var b = this.dampingProperty.get() * 0.002;
      this.beta = b * dt / 2;
      this.alpha = v * dt / dx;

      this.yNext[ 0 ] = this.yNow[ 0 ];
      switch( this.typeEndProperty.get() ) {
        case'looseEnd':
          this.yNow[ this.nSegs - 1 ] = this.yNow[ this.nSegs - 2 ];
          break;
        case'noEnd':
          this.yNow[ this.nSegs - 1 ] = this.yLast[ this.nSegs - 2 ];
          break;
        default: //'fixedEnd'
          this.yNow[ this.nSegs - 1 ] = 0;
      }

      //main formula for calculating
      var a = 1 / ( this.beta + 1 );
      var alphaSq = this.alpha * this.alpha;
      var c = 2 * ( 1 - alphaSq );
      for ( var i = 1; i < (this.nSegs - 1); i++ ) {
        this.yNext[ i ] = a * ((this.beta - 1) * this.yLast[ i ] + c * this.yNow[ i ] + alphaSq * (this.yNow[ i + 1 ] + this.yNow[ i - 1 ]) );
      }

      // store old values for the very last point
      var lastIndex = this.nSegs - 1;
      var oldLast = this.yLast[ lastIndex ];
      var oldNow = this.yNow[ lastIndex ];
      var oldNext = this.yNext[ lastIndex ];

      // rotate arrays instead of copying elements (for speed)
      var old = this.yLast;
      this.yLast = this.yNow;
      this.yNow = this.yNext;
      this.yNext = old;

      // restore the old values for the very last point for every array (potentially not needed for a few?)
      this.yLast[ lastIndex ] = oldLast;
      this.yNow[ lastIndex ] = oldNow;
      this.yNext[ lastIndex ] = oldNext;

      switch( this.typeEndProperty.get() ) {
        case'looseEnd':
          this.yLast[ this.nSegs - 1 ] = this.yNow[ this.nSegs - 1 ];
          this.yNow[ this.nSegs - 1 ] = this.yNow[ this.nSegs - 2 ];
          break;
        case'noEnd':
          this.yLast[ this.nSegs - 1 ] = this.yNow[ this.nSegs - 1 ];
          this.yNow[ this.nSegs - 1 ] = this.yLast[ this.nSegs - 2 ]; // from a comment in the old model code?
          // from the Flash model: this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 1];//this.yLast[this.nSegs - 2];
          break;
        default: //'fixedEnd'
          this.yLast[ this.nSegs - 1 ] = 0;
          this.yNow[ this.nSegs - 1 ] = 0;
      }
    },
    manualStep: function( dt ) {
      var i;
      var fixDt = 1 / fps;
      dt = (dt !== undefined && dt > 0 ) ? dt : fixDt;

      // preparation to interpolate the yNow across individual evolve() steps to smooth the string on slow-FPS browsers
      var startingLeftY = this.yNow[ 0 ];
      var numSteps = Math.floor( dt / fixDt );
      var perStepDelta = numSteps ? ( ( this.nextLeftY - startingLeftY ) / numSteps ) : 0;

      //dt for tension effect
      var minDt = (1 / (fps * (0.2 + this.tensionProperty.get() * 0.4) * this.speedProperty.get()));
      // limit max dt
      while ( dt >= fixDt ) {
        this.timeProperty.set( this.timeProperty.get() + fixDt );

        if ( this.timerStartProperty.get() ) {
          this.timerSecondProperty.set( this.timerSecondProperty.get() + fixDt * this.speedProperty.get() );
        }

        if ( this.modeProperty.get() === 'oscillate' ) {
          this.angleProperty.set( this.angleProperty.get() +
                                  Math.PI * 2 * this.frequencyProperty.get() * fixDt * this.speedProperty.get() );
          this.angleProperty.set( this.angleProperty.get() % ( Math.PI * 2 ) );
          this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.get() * this.dotPerCm * Math.sin( -this.angleProperty.get() );
        }
        if ( this.modeProperty.get() === 'pulse' && this.pulsePendingProperty.get() ) {
          this.pulsePendingProperty.set( false );
          this.pulseProperty.set( true );
          this.yNow[ 0 ] = 0;
        }
        if ( this.modeProperty.get() === 'pulse' && this.pulseProperty.get() ) {
          var da = Math.PI * fixDt * this.speedProperty.get() / this.pulseWidthProperty.get();
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
          this.yDraw[ 0 ] = this.yNow[ 0 ] = this.amplitudeProperty.get() * this.dotPerCm * (-this.angleProperty.get() / (Math.PI / 2));
        }
        if ( this.modeProperty.get() === 'manual' ) {
          // interpolate the yNow across steps for manual (between frames)
          this.yNow[ 0 ] += perStepDelta;
        }
        if ( this.timeProperty.get() >= minDt ) {
          this.timeProperty.set( this.timeProperty.get() % minDt );
          this.evolve();
          for ( i = 0; i < this.nSegs; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ];
          }
        }
        else {
          for ( i = 1; i < this.nSegs; i++ ) {
            this.yDraw[ i ] = this.yLast[ i ] + ((this.yNow[ i ] - this.yLast[ i ]) * (this.timeProperty.get() / minDt));
          }
        }
        dt -= fixDt;
      }
      if ( this.modeProperty.get() === 'manual' ) {
        // sanity check for our yNow
        // this.yNow[0] = this.nextLeftY;
      }
      this.yNowChanged.emit();
    },
    //restart button
    manualRestart: function() {
      //only soft reset
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      this.pulseSignProperty.reset();
      this.pulsePendingProperty.reset();
      this.customDt = 0;
      for ( var i = 0; i < this.yNow.length; i++ ) {
        this.yDraw[ i ] = this.yNext[ i ] = this.yNow[ i ] = this.yLast[ i ] = 0;
      }
      this.nextLeftY = 0;
      this.yNowChanged.emit();
    },
    //pulse button
    manualPulse: function() {
      this.yNow[ 0 ] = 0;
      this.angleProperty.set( 0 );
      this.pulseSignProperty.set( 1 );
      this.pulsePendingProperty.set( true );
      this.pulseProperty.set( false );
    }

  } );

  waveOnAString.register( 'WOASModel', WOASModel );

  return WOASModel;
} );
