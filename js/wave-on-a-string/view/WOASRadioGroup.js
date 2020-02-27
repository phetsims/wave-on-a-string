// Copyright 2020, University of Colorado Boulder

/**
 * Control WOASRadioGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';

class WOASRadioGroup extends VerticalAquaRadioButtonGroup {
  /**
   * @param {Property.<*>} property
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( property, tandem, options ) {
    const length = options.radio.length;
    const group = [];

    for ( let i = 0; i < length; i++ ) {
      group.push( {
        node: new Text( options.text[ i ], {
          font: new PhetFont( 20 ),
          maxWidth: 250
        } ),
        value: options.radio[ i ],
        tandemName: options.tandemNames[ i ]
      } );
    }

    super( property, group, merge( {
      spacing: 16,
      touchAreaXDilation: 10,
      radioButtonOptions: {
        radius: 12,
        selectedColor: Constants.radioColor.toCSS()
      },
      scale: 0.5,
      tandem: tandem
    }, options ) );
  }
}

waveOnAString.register( 'WOASRadioGroup', WOASRadioGroup );
export default WOASRadioGroup;