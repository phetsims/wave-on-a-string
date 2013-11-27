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
    fps = 48;

  function WOASModel() {
    this.customDt = 0;
    //REVIEW: performance: typed arrays may increase model performance where available? (Float32Array or Float64Array, but I believe they aren't available on IE9)
    //MLL: Float32Array or Float64Array are not available on IE9
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
      amplitude: 1.5, // amplitude 0.0 .. 3.0
      play: true, // play/pause state
      lastDt: 0.03,
      time: 0, // base time
      angle: 0, // angle for 'oscillate' and 'pulse' mode
      pulse: false, // 'pulse' mode pulse active
      rulerLocH: new Vector2( 54, 117 ), //position horizontal ruler
      rulerLocV: new Vector2( 13, 440 ), //position vertical ruler
      referenceLineLoc: new Vector2( -10, 120 ), // position referenceLine
      timerStart: false, // timer start/pause status
      timerSecond: 0, // timer time in seconds
      timerLoc: new Vector2( 475, 318 ), // position timer
      pulseSign: 1 // sign [-1, 1] for pulse mode
    } );

    this.nSegs = NSEGS;
    this.beta = 0.05;
    this.alpha = 1;
    this.reset();
  }

  inherit( PropertySet, WOASModel, {
    step: function( dt ) {
      if ( Math.abs( dt - this.lastDt ) > this.lastDt * 0.3 ) {
        dt = this.lastDt + ((dt - this.lastDt) < 0 ? -1 : 1) * this.lastDt * 0.3;
      }
      this.lastDt = dt;

      if ( this.play ) {
        this.customDt += dt;
        if ( this.customDt >= 1 / (fps * this.speed) ) {
          this.manualStep( this.customDt );
          this.customDt = 0;
        }
        else {
          for ( var i = 1; i < this.nSegs; i++ ) {
            this.yDraw[i] = this.yLast[i] + ((this.yNow[i] - this.yLast[i]) * (this.customDt / 1 / (fps * this.speed)));
          }
        }
      }
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

      for ( var j = 0; j < (this.nSegs - 1); j++ ) {
        this.yLast[j] = this.yNow[j];
        this.yNow[j] = this.yNext[j];
      }

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

      if ( this.timerStart ) {
        this.timerSecond += dt * this.speed;
      }

      var minDt = (1 / (fps * (0.2 + this.tension * 0.4) * this.speed));
      // for dt > 1 / fps
      while ( dt >= fixDt ) {
        this.time += fixDt;

        if ( this.mode === 'oscillate' ) {
          this.angle += Math.PI * 2 * this.frequency * fixDt * this.speed;
          this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
          this.angle %= Math.PI * 2;
        }
        if ( this.mode === 'pulse' && this.pulse ) {
          var k = 1 / this.pulseWidth * this.speed;
          var da = Math.PI * k * fixDt;
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
          this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * (-this.angle / (Math.PI / 2));
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
      this.trigger( 'yNowChanged' );
    },
    //restart button
    manualRestart: function() {
      //only soft reset
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      this.pulseSignProperty.reset();
      this.customDt = 0;
      for ( var i = 0; i < this.yNow.length; i++ ) {
        this.yDraw[i] = this.yNext[i] = this.yNow[i] = this.yLast[i] = 0;
      }
      this.trigger( 'yNowChanged' );
    },
    //pulse button
    manualPulse: function() {
      this.yNow[0] = 0;
      this.angle = 0;
      this.pulseSign = 1;
      this.pulse = true;
    }

  } );

  return WOASModel;
} );
