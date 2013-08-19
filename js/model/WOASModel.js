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
    fps = 30;

  function WOASModel( width, height ) {
    this.width = width;
    this.height = height;
    this.yNow = new Array( NSEGS );
    this.yLast = new Array( NSEGS );
    this.yNext = new Array( NSEGS );
    this.yLongNow = new Array( NSEGS );
    this.yLongLast = new Array( NSEGS );
    this.yLongNext = new Array( NSEGS );
    this.dotPerCm = 80;
    this.pulseSign = 1;
    PropertySet.call( this, {
      'mode': 'manual', // 'manual', 'oscillate', 'pulse'
      'typeEnd': 'fixedEnd', // 'fixedEnd', 'looseEnd', 'noEnd'
      'speed': 1, // 1, 0.25
      'rulers': false, // visible rulers
      'timer': false,  // visible timer
      'referenceLine': false, // visible referenceLine
      'tension': 10, // tension 8..10
      'damping': 50, // dumping 0..100
      'frequency': 1.50, // frequency 0.00 .. 3.00
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
    this.nSegsK = 0;
    this.beta = 0.05;
    this.alpha = 1;
    this.manualRestart();
    this.reset();
  }

  inherit( PropertySet, WOASModel, {
    step: function( dt ) {
      if ( this.play ) {
        this.manualStep( dt );
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
    //find middle value in array
    middleValue: function( arr, n ) {
      var n1 = Math.min( Math.floor( n ), (arr.length - 1) ),
        n2 = Math.min( Math.ceil( n ), (arr.length - 1) );
      return arr[n1] + (arr[n2] - arr[n1]) * (n - n1);
    },
    //elongation strings array
    longStrings: function( arr, k ) {
      if ( k === 1 ) {
        return arr.slice( 0 );
      }
      var nSize = Math.round( arr.length * k ),
        nArr = new Array( nSize ),
        i = 1;
      for ( i = 0; i < nSize; i++ ) {
        nArr[i] = this.middleValue( arr, i / k );
      }
      nArr[0] = arr[0];
      nArr[nSize - 1] = arr[arr.length - 1];
      return nArr;
    },
    //shortening strings array
    shortStrings: function( arr, k ) {
      if ( k === 1 ) {
        return arr.slice( 0 );
      }
      var nSize = Math.round( arr.length / k ),
        nArr = new Array( nSize ),
        i = 0;
      for ( i = 0; i < nSize; i++ ) {
        nArr[i] = this.middleValue( arr, i * k );
      }
      nArr[0] = arr[0];
      nArr[nSize - 1] = arr[arr.length - 1];
      return nArr;
    },
    //next step strings array calculated
    evolve: function() {
      var dt = this.speed,
        v = 1 - (10 - this.tension) * 0.3 ,
        dx = dt * v,
        b = this.damping * 0.002,
        k = 1 / dx;
      this.beta = b * dt / 2;
      this.alpha = v * dt / dx;
      // generation new lenght array for the strings
      if ( this.nSegsK !== Math.round( this.nSegs * k ) ) {
        this.manualRestart();
        this.nSegsK = Math.round( this.nSegs * k );
        this.yLongLast = this.longStrings( this.yLast, k );
        this.yLongNow = this.longStrings( this.yNow, k );
        this.yLongNext = this.longStrings( this.yNext, k );
      }
      this.yLongNow[0] = this.yLongNext[0] = this.yNext[0] = this.yNow[0];
      if ( this.typeEnd === 'fixedEnd' ) {			//if fixedEnd, then fix the end
        this.yLongNow[this.nSegsK - 1] = 0;
      }
      else if ( this.typeEnd === 'looseEnd' ) {		//else if looseEnd
        this.yLongNow[this.nSegsK - 1] = this.yLongNow[this.nSegsK - 2];
      }
      else if ( this.typeEnd === 'noEnd' ) {		//else if noEnd
        this.yLongNow[this.nSegsK - 1] = this.yLongLast[this.nSegsK - 2];
      }
      //main formula for calculating
      for ( var i = 1; i < (this.nSegsK - 1); i++ ) {
        this.yLongNext[i] = (1 / (this.beta + 1)) * ((this.beta - 1) * this.yLongLast[i] + 2 * (1 - (this.alpha * this.alpha)) * this.yLongNow[i] + (this.alpha * this.alpha) * (this.yLongNow[i + 1] + this.yLongNow[i - 1])   );
      }

      for ( var j = 1; j < (this.nSegsK - 1); j++ ) {
        this.yLongLast[j] = this.yLongNow[j];
        this.yLongNow[j] = this.yLongNext[j];
      }
      if ( this.typeEnd === 'fixedEnd' ) {
        this.yLongLast[this.nSegsK - 1] = 0;
        this.yLongNow[this.nSegsK - 1] = 0;
      }
      if ( this.typeEnd === 'looseEnd' ) {
        this.yLongLast[this.nSegsK - 1] = this.yLongNow[this.nSegsK - 1];
        this.yLongNow[this.nSegsK - 1] = this.yLongNow[this.nSegsK - 2];
      }
      if ( this.typeEnd === 'noEnd' ) {
        this.yLongLast[this.nSegsK - 1] = this.yLongNow[this.nSegsK - 1];
        this.yLongNow[this.nSegsK - 1] = this.yLongNow[this.nSegsK - 1];
      }
      //shortening array for view
      this.yLast = this.shortStrings( this.yLongLast, k );
      this.yNow = this.shortStrings( this.yLongNow, k );
      this.yNext = this.shortStrings( this.yLongNext, k );
    },
    manualStep: function( dt ) {
      dt = dt || (1 / fps);
      this.time += dt;
      if ( this.timerStart ) {
        this.timerSecond += dt * this.speed;
      }
      if ( this.time >= (1 / fps) ) {

        if ( this.mode === 'oscillate' ) {
          this.angle += Math.PI * 2 * this.frequency * this.time * this.speed;
          this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
          if ( this.angle >= Math.PI * 2 ) {
            this.angle = Math.PI * 2 * this.frequency * this.time * this.speed;
          }
        }
        if ( this.mode === 'pulse' && this.pulse ) {

          var da = Math.PI * 2 * this.frequency * this.time * this.speed;
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
          this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
        }
        this.time = 0;
        this.evolve();
      }
      this.yNowChanged = !this.yNowChanged;
    },
    manualRestart: function() {
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      for ( var i = 0; i < this.yNow.length; i++ ) {
        this.yNext[i] = this.yNow[i] = this.yLast[i] = 0;
      }
      this.nSegsK = 0;
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