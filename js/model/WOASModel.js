/**
 * Copyright 2002-2013, University of Colorado
 * main Model container.
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  var NSEGS = 61,
    fps = 50;

  function WOASModel() {
    this.stepDt = 0;
    var Array = window.Float64Array || window.Array;

    this.yDraw = new Array( NSEGS );
    this.yNow = new Array( NSEGS );
    this.yLast = new Array( NSEGS );
    this.yNext = new Array( NSEGS );
    this.dotPerCm = 80;
    PropertySet.call( this, {
      mode: 'manual', // 'manual', 'oscillate', 'pulse'
      typeEnd: 'fixedEnd', // 'fixedEnd', 'looseEnd', 'noEnd'
      speed: 1, // 1, 0.25
      rulers: false, // visible rulers
      timer: false,  // visible timer
      referenceLine: false, // visible referenceLine
      tension: 2, // tension 0..2
      damping: 50, // dumping 0..100
      frequency: 1.50, // frequency 0.00 .. 3.00
      pulseWidth: 0.5, // pulse width 0.00 .. 1.00
      amplitude: 0.75, // amplitude 0.0 .. 1.5
      play: true, // play/pause state
      lastDt: 0.03,
      time: 0, // base time
      angle: 0, // angle for 'oscillate' and 'pulse' mode
      pulsePending: false, // whether a pulse will start at the next proper model step
      pulse: false, // 'pulse' mode pulse active
      rulerLocH: new Vector2( 54, 117 ), //position horizontal ruler
      rulerLocV: new Vector2( 13, 440 ), //position vertical ruler
      referenceLineLoc: new Vector2( -10, 120 ), // position referenceLine
      timerStart: false, // timer start/pause status
      timerSecond: 0, // timer time in seconds
      timerLoc: new Vector2( 475, 318 ), // position timer
      pulseSign: 1 // sign [-1, 1] for pulse mode
    } );

    this.nextLeftY = 0; // used to interpolate the left-most y value of the string while the wrench is moved in manual mode, for low-FPS browsers
    this.nSegs = NSEGS;
    this.beta = 0.05;
    this.alpha = 1;
    this.reset();
  }

  inherit( PropertySet, WOASModel, {
    step: function( dt ) {
      var fixDt = 1 / fps;
      // limit changes dt
      if ( Math.abs( dt - this.lastDt ) > this.lastDt * 0.3 ) {
        dt = this.lastDt + ((dt - this.lastDt) < 0 ? -1 : 1) * this.lastDt * 0.3;
      }
      this.lastDt = dt;

      if ( this.play ) {
        this.stepDt += dt;
        //limit min dt
        if ( this.stepDt >= fixDt ) {
          this.manualStep( this.stepDt );
          this.stepDt %= fixDt;
        }
      }
      this.nextLeftY = this.yNow[0];
    },
    // all reset button
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.manualRestart();
    },
    //next step strings array calculated
    evolve: function() {
      var dt = 1,
        v = 1,
        dx = dt * v,
        b = this.damping * 0.002;
      this.beta = b * dt / 2;
      this.alpha = v * dt / dx;

      this.yNext[0] = this.yNow[0];
      switch( this.typeEnd ) {
        case'looseEnd':
          this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 2];
          break;
        case'noEnd':
          this.yNow[this.nSegs - 1] = this.yLast[this.nSegs - 2];
          break;
        default: //'fixedEnd'
          this.yNow[this.nSegs - 1] = 0;
      }

      //main formula for calculating
      var a = 1 / ( this.beta + 1 ), alphaSq = this.alpha * this.alpha, c = 2 * ( 1 - alphaSq );
      for ( var i = 1; i < (this.nSegs - 1); i++ ) {
        this.yNext[i] = a * ((this.beta - 1) * this.yLast[i] + c * this.yNow[i] + alphaSq * (this.yNow[i + 1] + this.yNow[i - 1]) );
      }

      // store old values for the very last point
      var lastIndex = this.nSegs - 1;
      var oldLast = this.yLast[lastIndex];
      var oldNow = this.yNow[lastIndex];
      var oldNext = this.yNext[lastIndex];

      // rotate arrays instead of copying elements (for speed)
      var old = this.yLast;
      this.yLast = this.yNow;
      this.yNow = this.yNext;
      this.yNext = old;

      // restore the old values for the very last point for every array (potentially not needed for a few?)
      this.yLast[lastIndex] = oldLast;
      this.yNow[lastIndex] = oldNow;
      this.yNext[lastIndex] = oldNext;

      switch( this.typeEnd ) {
        case'looseEnd':
          this.yLast[this.nSegs - 1] = this.yNow[this.nSegs - 1];
          this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 2];
          break;
        case'noEnd':
          this.yLast[this.nSegs - 1] = this.yNow[this.nSegs - 1];
          this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 1];
          break;
        default: //'fixedEnd'
          this.yLast[this.nSegs - 1] = 0;
          this.yNow[this.nSegs - 1] = 0;
      }
    },
    manualStep: function( dt ) {
      var i;
      var fixDt = 1 / fps;
      dt = (dt !== undefined && dt > 0 ) ? dt : fixDt;

      // preparation to interpolate the yNow across individual evolve() steps to smooth the string on slow-FPS browsers
      var startingLeftY = this.yNow[0];
      var numSteps = Math.floor( dt / fixDt );
      var perStepDelta = numSteps ? ( ( this.nextLeftY - startingLeftY ) / numSteps ) : 0;

      //dt for tension effect
      var minDt = (1 / (fps * (0.2 + this.tension * 0.4) * this.speed));
      console.log( minDt, fixDt );
      // limit max dt
      while ( dt >= fixDt ) {
        this.time += fixDt;

        if ( this.timerStart ) {
          this.timerSecond += fixDt * this.speed;
        }

        if ( this.mode === 'oscillate' ) {
          this.angle += Math.PI * 2 * this.frequency * fixDt * this.speed;
          this.angle %= Math.PI * 2;
          this.yDraw[0] = this.yNow[0] = this.amplitude * this.dotPerCm * Math.sin( -this.angle );
        }
        if ( this.mode === 'pulse' && this.pulsePending ) {
          this.pulsePending = false;
          this.pulse = true;
        }
        if ( this.mode === 'pulse' && this.pulse ) {
          var da = Math.PI * fixDt * this.speed / this.pulseWidth;
          if ( this.angle + da >= Math.PI / 2 ) {
            this.pulseSign = -1;
          }
          if ( this.angle + da * this.pulseSign > 0 ) {
            this.angle += da * this.pulseSign;
          }
          else {
            //end pulse and reset
            this.angleProperty.reset();
            this.pulseSignProperty.reset();
            this.pulseProperty.reset();
          }
          this.yDraw[0] = this.yNow[0] = this.amplitude * this.dotPerCm * (-this.angle / (Math.PI / 2));
        }
        if ( this.mode === 'manual' ) {
          // interpolate the yNow across steps for manual (between frames)
          this.yNow[0] += perStepDelta;
        }
        if ( this.time >= minDt ) {
          this.time %= minDt;
          this.evolve();
          for ( i = 0; i < this.nSegs; i++ ) {
            this.yDraw[i] = this.yLast[i];
          }
        }
        else {
          for ( i = 1; i < this.nSegs; i++ ) {
            this.yDraw[i] = this.yLast[i] + ((this.yNow[i] - this.yLast[i]) * (this.time / minDt));
          }
        }
        dt -= fixDt;
      }
      if ( this.mode === 'manual' ) {
        // sanity check for our yNow
        this.yNow[0] = this.nextLeftY;
      }
      this.trigger( 'yNowChanged' );
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
        this.yDraw[i] = this.yNext[i] = this.yNow[i] = this.yLast[i] = 0;
      }
      this.nextLeftY = 0;
      this.trigger( 'yNowChanged' );
    },
    //pulse button
    manualPulse: function() {
      this.yNow[0] = 0;
      this.angle = 0;
      this.pulseSign = 1;
      this.pulsePending = true;
      this.pulse = false;
    }

  } );

  return WOASModel;
} );
