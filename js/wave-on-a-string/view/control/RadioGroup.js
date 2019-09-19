// Copyright 2013-2019, University of Colorado Boulder

/**
 * Control RadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  /**
   * @param {Property} property
   * @param {Object} [options]
   * @constructor
   */
  function RadioGroup( property, options ) {

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
        value: options.radio[ i ]
      } );
    }

    var radioGroup = new VerticalAquaRadioButtonGroup( property, group, {
      spacing: 16,
      touchAreaXDilation: 10,
      radioButtonOptions: {
        radius: 12,
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
