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
  
  //REVIEW: doc: is the width/height passed in here mainly used as the bounds of the model area? I don't see it being used in the actual model itself anywhere
  function WOASModel( width, height ) {
    this.width = width;
    this.height = height;
    this.customDt = 0;
    //REVIEW: performance: typed arrays may increase model performance where available? (Float32Array or Float64Array, but I believe they aren't available on IE9)
    this.yDraw = new Array( NSEGS );
    this.yNow = new Array( NSEGS );
    this.yLast = new Array( NSEGS );
    this.yNext = new Array( NSEGS );
    this.dotPerCm = 80;
    this.pulseSign = 1;
    PropertySet.call( this, {
      //REVIEW: would prefer removal of unnecessary single quotes on left-hand-side. For example: mode: 'manual',
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
      /*REVIEW:
       * yNowChanged property should be replaced with trigger/on:
       *
       * To send the "yNow changed event", call:
       * model.trigger( 'yNowChanged' ); // or this.trigger( 'yNowChanged' ) within WOASModel.js
       *
       * To add a function to run whenever the "yNow changed event" is triggered:
       * model.on( 'yNowChanged', callback ); // callback called on trigger
       *
       * Or to remove the listener:
       * model.off( 'yNowChanged', callback );
       *
       * Also notably, arguments can be passed (although not necessary in this case):
       * model.trigger( 'someName', a, b ) will run callback( a, b )
       */
      'yNowChanged': false, // yNow array changed flag
      'time': 0, // base time
      'angle': 0, // angle for 'oscillate' and 'pulse' mode
      'pulse': false, // 'pulse' mode pulse active
      //REVIEW: would prefer use of DOT/Vector2 for 2D points. for example: rulerLocH: new Vector2( 54, 117 )
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
      //REVIEW: pulseWidth is not reset here!
      /*REVIEW:
       * In order to simplify the code, PropertySet has a neat function reset() of its own. We are overriding this reset()
       * behavior, but we can still call it. The more convenient way would be to just:
       *
       * PropertySet.prototype.reset.call( this ); // every property gets .reset() called on it!
       * this.manualRestart(); // since we have extra logic here for yDraw
       *
       * NOTE: this change would reset yNowChanged to false, and after this.manualRestart(), yNowChanged would always be true.
       * I believe this is probably what is intended, I'm adding a note to below in manualRestart() also. If yNowChanged is
       * true at the start of reset(), and you want it to be false after the reset() including manualRestart() like it will occur now,
       * you will need to store the value first and change it after PropertySet.prototype.reset.call( this ).
       *
       * This is because currently if yNowChanged = true and reset() is called, the property is not currently reset, and in manualRestart()
       * it would be toggled to false (probably not the desired behavior).
       *
       * Referenced by https://github.com/phetsims/wave-on-a-string/issues/16
       */
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
      //REVIEW: switch most appropriate here, so that we can add a default case to throw an error if this.typeEnd isn't one of the three values?
      if ( this.typeEnd === 'fixedEnd' ) {
        //if fixedEnd, then fix the end
        this.yNow[this.nSegs - 1] = 0;
      }
      //REVIEW: the "//else if looseEnd" and "//else if noEnd" can be discarded (not helpful), even though they were from the original AS3 Flash code.
      else if ( this.typeEnd === 'looseEnd' ) {		//else if looseEnd
        this.yNow[this.nSegs - 1] = this.yNow[this.nSegs - 2];
      }
      else if ( this.typeEnd === 'noEnd' ) {		//else if noEnd
        this.yNow[this.nSegs - 1] = this.yLast[this.nSegs - 2];
      }
      
      //main formula for calculating
      /*REVIEW: performance: constants involving alpha and beta do not change in this inner loop. please extract to a variable outside the loop.
       * For example: var a = 1 / ( this.beta + 1 ), alphaSq = this.alpha * this.alpha, b = 2 * ( 1 - alphaSq );
       */
      for ( var i = 1; i < (this.nSegs - 1); i++ ) {
        this.yNext[i] = (1 / (this.beta + 1)) * ((this.beta - 1) * this.yLast[i] + 2 * (1 - (this.alpha * this.alpha)) * this.yNow[i] + (this.alpha * this.alpha) * (this.yNow[i + 1] + this.yNow[i - 1])   );
      }
      
      /*REVIEW: performance:
       * Instead of doing full array copies here, please do something like the following:
       *
       * this.yLast = this.yNow;
       * this.yNow = this.yNext;
       *
       * And change the way of setting this.yLast[this.nSegs - 1] and this.yNow[this.nSegs - 1] to be compatible with this change.
       *
       * This should improve the performance of the model fairly significantly, depending on the browser.
       */
      for ( var j = 0; j < (this.nSegs - 1); j++ ) {
        this.yLast[j] = this.yNow[j];
        this.yNow[j] = this.yNext[j];
      }
      //REVIEW: switch most appropriate here, so that we can add a default case to throw an error if this.typeEnd isn't one of the three values?
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
      //REVIEW: performance: many constants don't change in thus function, and are reused (for instance, dt * this.speed). Would be best to compute these once and reuse them.
      var i;
      //REVIEW: although manualStep is never called with dt === 0 right now, it's best practice to handle this case (check if dt is undefined, since it would replace 0 with 1 / fps * this.speed)
      dt = dt || (1 / fps * this.speed);
      
      /*REVIEW:
       * This is currently not working well for large dts (in seconds, which happens when a tab freezes for a bit, or if a user switches away from the sim and comes back).
       *
       * For a large dt, we still only run one evolve() step, so the wave can't progress very far. However, the angle for the oscillation/pulse
       * will cover multiple steps' worth of radians. This results in discontinuities.
       *
       * Please see https://github.com/phetsims/wave-on-a-string/issues/18 for more details on how to trigger this for testing, and the main approach for fixing it.
       */
      this.time += dt;
      if ( this.timerStart ) {
        this.timerSecond += dt * this.speed;
      }
      var minDt = (1 / (fps * (0.2 + this.tension * 0.4) * this.speed));
      if ( this.mode === 'oscillate' ) {
        this.angle += Math.PI * 2 * this.frequency * dt * this.speed;
        this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
        
        if ( this.angle >= Math.PI * 2 ) {
          //REVIEW: shouldn't this be "this.angle %= Math.PI * 2"?   (referenced by https://github.com/phetsims/wave-on-a-string/issues/17)
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
          //REVIEW: doc: end of pulse
          this.pulseSign = 1;
          this.angle = 0;
          this.pulse = false;
        }
        this.yDraw[0] = this.yNow[0] = this.amplitude / 2 * this.dotPerCm * Math.sin( -this.angle );
      }
      if ( this.time >= minDt ) {
        //REVIEW: wouldn't this be "this.time % minDt"? Otherwise we don't go as far forward in our interpolation as we should
        this.time = 0;
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
      
      //REVIEW: Please use this.trigger( 'yNowChanged' ) as noted above
      this.yNowChanged = !this.yNowChanged;
    },
    manualRestart: function() {
      //REVIEW: These 3 resets would be removed (unnecessary) with my above suggested modifications to reset()
      this.angleProperty.reset();
      this.timeProperty.reset();
      this.pulseProperty.reset();
      this.customDt = 0;
      for ( var i = 0; i < this.yNow.length; i++ ) {
        this.yDraw[i] = this.yNext[i] = this.yNow[i] = this.yLast[i] = 0;
      }
      
      //REVIEW: Please use this.trigger( 'yNowChanged' ) as noted above
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
