/**
 * Copyright 2002-2013, University of Colorado
 * Control RadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Strings = require( 'Strings' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function RadioGroup( options ) {
    Node.call( this, {x: options.x, y: options.y, scale: 0.7} );
    var i = 0,
      length = options.radio.length,
      group = [];
    for ( ; i < length; i++ ) {
      group.push( { node: new Text( Strings[options.radio[i]], {font: new PhetFont( 15 )} ), property: options.property, value: options.radio[i] } );
    }
    var radioGroup = new Panel( new VerticalAquaRadioButtonGroup( group ), { fill: '#D9FCC5', xMargin: 10, yMargin: 5} );
    this.addChild( radioGroup );
  }

  inherit( Node, RadioGroup );

  return RadioGroup;
} );