// Copyright 2025, University of Colorado Boulder

/**
 * Control WOASRadioButtonGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import Constants from '../Constants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions<T> = {
  radio: T[];
  text: TReadOnlyProperty<string>[];
  tandemNames: string[];
};

type SuperOptions = VerticalAquaRadioButtonGroupOptions;

export type WOASRadioButtonGroupOptions<T> = SelfOptions<T> & SuperOptions;

export default class WOASRadioButtonGroup<T> extends VerticalAquaRadioButtonGroup<T> {
  public constructor( property: PhetioProperty<T>, tandem: Tandem, providedOptions?: WOASRadioButtonGroupOptions<T> ) {
    const options = optionize<WOASRadioButtonGroupOptions<T>, SelfOptions<T>, SuperOptions>()( {
      spacing: 16,
      touchAreaXDilation: 10,
      radioButtonOptions: {
        radius: 12,
        selectedColor: Constants.radioColor.toCSS()
      },
      scale: 2 / 3,
      tandem: tandem
    }, providedOptions );

    const length = options.radio.length;
    const group = [];

    for ( let i = 0; i < length; i++ ) {
      group.push( {
        createNode: () => new Text( options.text[ i ], {
          font: new PhetFont( 20 ),
          maxWidth: 250
        } ),
        value: options.radio[ i ],
        tandemName: options.tandemNames[ i ]
      } );
    }

    super( property, group, options );
  }
}

waveOnAString.register( 'WOASRadioButtonGroup', WOASRadioButtonGroup );