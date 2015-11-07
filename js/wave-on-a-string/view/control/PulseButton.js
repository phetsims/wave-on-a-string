// Copyright 2013-2015, University of Colorado Boulder

/**
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
        model.play = true;
        model.trigger( 'yNowChanged' );
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

  inherit( RoundPushButton, PulseButton );

  return PulseButton;
} );
