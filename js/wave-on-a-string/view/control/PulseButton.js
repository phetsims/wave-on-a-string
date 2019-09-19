// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control PulseButton view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Shape = require( 'KITE/Shape' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  function PulseButton( model, options ) {
    var pulseShape = new Shape().moveTo( -9, 0 ).lineTo( -3.5, 0 ).lineTo( 0, -10 ).lineTo( 3.5, 0 ).lineTo( 9, 0 );

    var pulsePath = new Path( pulseShape, {
      lineWidth: 1.5,
      stroke: '#333',
      lineCap: 'round'
    } );

    var pulsePath2 = new Path( pulseShape, {
      lineWidth: 3,
      stroke: '#eee',
      lineCap: 'round'
    } );

    RoundPushButton.call( this, {
      listener: function() {
        model.manualPulse();
        model.playProperty.set( true );
        model.yNowChanged.emit();
      },
      // listener: model.manualPulse.bind( model ),
      baseColor: '#33dd33',
      content: new Node( { children: [ pulsePath2, pulsePath ] } ),
      radius: 17,
      yContentOffset: -1
    } );
    var self = this;
    this.touchArea = this.localBounds.dilatedXY( 5, 10 );
    this.mutate( options );
    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  waveOnAString.register( 'PulseButton', PulseButton );

  inherit( RoundPushButton, PulseButton );

  return PulseButton;
} );
