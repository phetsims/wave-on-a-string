// Copyright 2020, University of Colorado Boulder

/**
 * Control WOASRadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  class WOASRadioGroup extends Node {
    /**
     * @param {Property.<*>} property
     * @param {Object} [options]
     */
    constructor( property, options ) {
      options = merge( {
        scale: 0.5
      }, options );

      super();

      const length = options.radio.length;
      const group = [];

      for ( let i = 0; i < length; i++ ) {
        group.push( {
          node: new Text( options.text[ i ], {
            font: new PhetFont( 20 ),
            maxWidth: 250
          } ),
          value: options.radio[ i ]
        } );
      }

      const radioGroup = new VerticalAquaRadioButtonGroup( property, group, {
        spacing: 16,
        touchAreaXDilation: 10,
        radioButtonOptions: {
          radius: 12,
          selectedColor: Constants.radioColor.toCSS()
        }
      } );

      this.addChild( options.omitPanel ? radioGroup : new Panel( radioGroup, { fill: '#D9FCC5', xMargin: 14, yMargin: 14 } ) );

      this.mutate( options );
    }
  }

  return waveOnAString.register( 'WOASRadioGroup', WOASRadioGroup );
} );
