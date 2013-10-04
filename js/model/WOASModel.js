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

  var NSEGS = 61,
    fps = 48;

  function WOASModel( width, height ) {
    this.width = width;
    this.height = height;
    this.customDt = 0;
    this.yDraw = new Array( NSEGS );
    this.yNow = new Array( NSEGS );
    this.yLast = new Array( NSEGS );
    this.yNext = new Array( NSEGS );
    this.dotPerCm = 80;
    this.pulseSign = 1;
    PropertySet.call( this, {
      'mode': 'manual', // 'manual', 'oscillate', 'pulse'
      'typeEnd': 'fixedEnd', // 'fixedEnd', 'looseEnd', 'noEnd'
      'speed': 1, // 1, 0.25
      'rulers': false, // visible rulers
      'timer': false,  // visible timer
      'referenceLine': false, // visible referenceLine
      'tension': 2, // tension 0..2
      'damping': 50, // dumping 0..100
      'frequency': 1.50, // frequency 0.00 .. 3.00
      'pulseWidth': 2, // pulse width 0.0 .. 4.0
      'amplitude': 1.5, // amplitude 0.0 .. 3.0
      'play': true, // play/pause state
      'yNowChanged': false, // yNow array changed flag
      'time': 0, // base time
      'angle': 0, // angle for 'oscillate' and 'pulse' mode
      'pulse': false, // 'pulse' mode pulse active
      'rulerLocH': {x: 54, y: 117}, //position horizontal ruler
      'rulerLocV': {x: 13, y: 440}, //position vertical ruler
      'referenceLineLoc': {x: 0, y: 120}, // position referenceLine
      'timerStart': false, // timer start/pause status
      'timerSecond': 0, // timer time in seconds
      'timerLoc': {x: 475, y: 318} // position timer
    } );
    this.nSegs = NSEGS;
    this.beta = 0.05;
    this.alpha = 1;
    this.manualRestart();
    this.reset();
  }

  inherit( PropertySet, WOASModel, {
    step: function( dt ) {
      if ( this.play ) {
        this.customDt += dt;
        if ( this.customDt >= 1 / (fps * this.speed) ) {
          this.manualStep( this.customDt );
          this.customDt = 0;
        }
        else {
          for ( var i = 1; i < this.nSegs; i++ ) {
            //var yPresent = (1-ratio)*myString.yLast[i]+ratio*myString.yNow[i];
            this.yDraw[i] = this.yLast[i] + ((this.yNow[i] - this.yLast[i]) * (this.customDt / 1 / (fps * this.speed)));
          }
        }
      }
    },
    reset: function() {
      this.modeProperty.reset();
      this.typeEndProperty.reset();
      this.speedProperty.reset();
      this.tensionProperty.reset();
      this.dampingProperty.reset();
      this.frequencyProperty.reset();
      this.amplitudeProperty.reset();
      this.playProperty.reset();
      this.rulerLocHProperty.reset();
      this.rulerLocVProperty.reset();
      this.referenceLineLocProperty.reset();
      this.referenceLineProperty.reset();
      this.timerStartProperty.reset();
      this.timerSecondProperty.reset();
      this.timerProperty.reset();
      this.rulersProperty.reset();
      this.timerLocProperty.reset();
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
      if ( this.typeEnd === 'fixedEnd' ) {			//if fixedEnd, then fix the end
        this.yNow[this.nSegs - 1] = 0;
      }
      else if ( this.typeEnd === 'looseEnd' ) {		//else if looseEnd
        this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 2];
      }
      else if ( this.typeEnd === 'noEnd' ) {		//else if noEnd
        this.yNow[this.nSegs - 1] = this.yLast[this.nSegs - 2];
      }
      //main formula for calculating
      for ( var i = 1; i < (this.nSegs - 1); i++ ) {
        this.yNext[i] = (1 / (this.beta + 1)) * ((this.beta - 1) * this.yLast[i] + 2 * (1 - (this.alpha * this.alpha)) * this.yNow[i] + (this.alpha * this.alpha) * (this.yNow[i + 1] + this.yNow[i - 1])   );
      }

      for ( var j = 0; j < (this.nSegs - 1); j++ ) {
        this.yLast[j] = this.yNow[j];
        this.yNow[j] = this.yNext[j];
      }
      if ( this.typeEnd === 'fixedEnd' ) {
        this.yLast[this.nSegs - 1] = 0;
        this.yNow[this.nSegs - 1] = 0;
      }
      if ( this.typeEnd === 'looseEnd' ) {
        this.yLast[this.nSegs - 1] = this.yNow[this.nSegs - 1];
        this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 2];
      }
      if ( this.typeEnd === 'noEnd' ) {
        this.yLast[this.nSegs - 1] = this.yNow[this.nSegs - 1];
        this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 1];
      }
    },
    manualStep: function( dt ) {
      dt = dt || (1 / fps * this.speed);
      this.time += dt;
      if ( this.timerStart ) {
        this.timerSecond += dt * this.speed;
      }
      var minDt = (1 / (fps * (0.2 + this.tension * 0.4) * this.speed));
      if ( this.mode === 'oscillate' ) {
        this.angle += Math.PI * 2 * this.frequency * dt * this.speed;
        this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
        if ( this.angle >= Math.PI * 2 ) {
          this.angle = Math.PI * 2 * this.frequency * dt * this.speed;
        }
      }
      if ( this.mode === 'pulse' && this.pulse ) {
        var k = 1 / this.pulseWidth * this.speed;
        var da = Math.PI * k * dt;
        if ( this.angle + da >= Math.PI / 2 ) {
          this.pulseSign = -1;
        }
        if ( this.angle + da * this.pulseSign > 0 ) {
          this.angle += da * this.pulseSign;
        }
        else {
          this.pulseSign = 1;
          this.angle = 0;
          this.pulse = false;
        }
        this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
      }
      if ( this.time >= minDt ) {
        this.time = 0;
        this.evolve();
        for ( var i = 0; i < this.nSegs; i++ ) {
          this.yDraw[i] = this.yLast[i];
        }
      }
      else {
        for ( var i = 1; i < this.nSegs; i++ ) {
          this.yDraw[i] = this.yLast[i] + ((this.yNow[i] - this.yLast[i]) * (this.time / minDt));
        }
      }
      this.yNowChanged = !this.yNowChanged;
    },
    manualRestart: function() {
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      this.customDt = 0;
      for ( var i = 0; i < this.yNow.length; i++ ) {
        this.yDraw[i] = this.yNext[i] = this.yNow[i] = this.yLast[i] = 0;
      }
      this.yNowChanged = !this.yNowChanged;
    },
    manualPulse: function() {
      this.yNow[0] = 0;
      this.angle = 0;
      this.pulseSign = 1;
      this.pulse = true;
    }

  } );

  return WOASModel;
} );