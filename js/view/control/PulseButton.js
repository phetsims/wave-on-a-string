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
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Strings = require( 'Strings' );
  var PushButton = require( 'SUN/PushButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  function PulseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var self = this;
    var restart = function() {
      model.manualPulse();
    };
    var label = new Text( Strings.pulse, {fontSize: 17, centerX: 39, centerY: 20} );

    this.addChild( new PushButton(
      new Node( {children: [new Image( require( 'image!WOAS/../images/button_pulse_unpressed.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/../images/button_pulse_hover.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/../images/button_pulse_pressed.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/../images/button_pulse_unpressed.png' ) ), label]} ),
      restart, {scale: 0.7} ) );

    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, PulseButton );

  return PulseButton;
} );