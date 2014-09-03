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
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  function PulseButton( model, options ) {
    var pulseShape = new Shape().moveTo( -9, 0 ).lineTo( -4, 0 ).lineTo( 0, -6 ).lineTo( 4, 0 ).lineTo( 9, 0 );

    var pulsePath = new Path( pulseShape, {
      lineWidth: 1,
      stroke: '#333',
      lineCap: 'round'
    } );

    var pulsePath2 = new Path( pulseShape, {
      lineWidth: 3,
      stroke: '#5f5',
      lineCap: 'round'
    } );

    RoundPushButton.call( this, {
      listener: model.manualPulse.bind( model ),
      baseColor: '#33dd33',
      content: new Node( { children: [pulsePath2, pulsePath] } ),
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
