/**
 * Copyright 2002-2013, University of Colorado
 * Control PulseButton view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var pulse2String = require( 'string!WOAS/pulse2' );
  var TextPushButton = require( 'SUN/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function PulseButton( model, options ) {
    TextPushButton.call(this,pulse2String,{listener: model.manualPulse.bind( model ), font: new PhetFont( 12 ),rectangleFillUp:'#7CAF3A',rectangleFillDown:'#7CAF3A',rectangleFillOver:'#91B634'});
    var self = this;
    this.touchArea = Shape.bounds( Bounds2.rect(0,0,this.width,this.height).dilatedXY( 5, 10 ) );
    this.mouseArea = Shape.bounds( Bounds2.rect(0,0,this.width,this.height) );
    this.mutate( options );
    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( TextPushButton, PulseButton );

  return PulseButton;
} );
