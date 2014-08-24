/**
 * Copyright 2002-2013, University of Colorado
 * Control PulseButton view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // strings
  var pulse2String = require( 'string!WOAS/pulse2' );

  function PulseButton( model, options ) {
    TextPushButton.call( this, pulse2String, {
      listener: model.manualPulse.bind( model ),
      font: new PhetFont( 12 ),
      baseColor: '#7CAF3A'
    } );
    var self = this;
    this.touchArea = this.localBounds.dilatedXY( 5, 10 );
    this.mutate( options );
    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( TextPushButton, PulseButton );

  return PulseButton;
} );
