/**
 * Copyright 2002-2013, University of Colorado
 * Control RadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Panel = require( 'SUN/Panel' );
  var Constants = require( 'WOAS/Constants' );

  function RadioGroup( options ) {
    options = _.extend( { scale: 0.7 }, options );
    Node.call( this );
    var i = 0,
      length = options.radio.length,
      group = [];
    for ( ; i < length; i++ ) {
      group.push( { node: new Text( options.text[i], {font: new PhetFont( 15 )} ), property: options.property, value: options.radio[i] } );
    }
    var radioGroup = new Panel( new VerticalAquaRadioButtonGroup( group, {
      spacing: 8,
      radioButtonOptions: {
        selectedColor: Constants.radioColor.toCSS()
      }
    } ), { fill: '#D9FCC5', xMargin: 8, yMargin: 8 } );
    this.addChild( radioGroup );
    this.mutate( options );
  }

  inherit( Node, RadioGroup );

  return RadioGroup;
} );
