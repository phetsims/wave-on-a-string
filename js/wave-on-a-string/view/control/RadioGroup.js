// Copyright 2013-2017, University of Colorado Boulder

/**
 * Control RadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  function RadioGroup( options ) {
    options = _.extend( { scale: 0.5 }, options );
    Node.call( this );
    var length = options.radio.length;
    var group = [];
    for ( var i = 0; i < length; i++ ) {
      group.push( {
        node: new Text( options.text[ i ], {
          font: new PhetFont( 20 ),
          maxWidth: 250
        } ),
        property: options.property,
        value: options.radio[ i ]
      } );
    }
    var radioGroup = new VerticalAquaRadioButtonGroup( group, {
      spacing: 16,
      touchAreaXDilation: 10,
      radioButtonOptions: {
        selectedColor: Constants.radioColor.toCSS()
      }
    } );
    var panel = new Panel( radioGroup, { fill: '#D9FCC5', xMargin: 14, yMargin: 14 } );
    this.addChild( options.omitPanel ? radioGroup : panel );
    this.mutate( options );
  }

  waveOnAString.register( 'RadioGroup', RadioGroup );

  inherit( Node, RadioGroup );

  return RadioGroup;
} );
