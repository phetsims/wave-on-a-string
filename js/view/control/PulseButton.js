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
  var Node = require( 'SCENERY/nodes/Node' );
  var pulse2String = require( 'string!WOAS/pulse2' );
  var TextButton = require( 'SUN/TextButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function PulseButton( model, options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 1} );
    var self = this;
    var pulse = function() {
      model.manualPulse();
    };
    this.addChild(new TextButton( pulse2String, pulse, {font: new PhetFont( 12 ),rectangleFillUp:"#7CAF3A",rectangleFillDown:"#7CAF3A",rectangleFillOver:"#91B634"} ), {scale: 1});

    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, PulseButton );

  return PulseButton;
} );