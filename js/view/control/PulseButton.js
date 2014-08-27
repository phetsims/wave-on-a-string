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
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  function PulseButton( model, options ) {
    RoundPushButton.call( this, {
      listener: model.manualPulse.bind( model ),
      baseColor: '#33dd33',
      radius: 17
    } );
    var self = this;
    this.touchArea = this.localBounds.dilatedXY( 5, 10 );
    this.mutate( options );
    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( RoundPushButton, PulseButton );

  return PulseButton;
} );
