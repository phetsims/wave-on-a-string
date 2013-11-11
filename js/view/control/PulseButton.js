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
  var TextPushButton = require( 'SUN/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function PulseButton( model, options ) {
    Node.call( this );
    var self = this;
    this.addChild(new TextPushButton( pulse2String, {listener: model.manualPulse.bind( model ), font: new PhetFont( 12 ),rectangleFillUp:'#7CAF3A',rectangleFillDown:'#7CAF3A',rectangleFillOver:'#91B634'} ));
    this.mutate( options );
    model.modeProperty.link( function updatePulseButton( value ) {
      self.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, PulseButton );

  return PulseButton;
} );
