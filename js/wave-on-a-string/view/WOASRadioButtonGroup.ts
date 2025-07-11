// Copyright 2025, University of Colorado Boulder

/**
 * Control WOASRadioButtonGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { NORMAL_FONT } from '../WOASConstants.js';
import { PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';

type SelfOptions<T> = {
  radio: T[];
  text: TReadOnlyProperty<string>[];
  tandemNames: string[];
  accessibleNames: PDOMValueType[];
};

type SuperOptions = VerticalAquaRadioButtonGroupOptions;

export type WOASRadioButtonGroupOptions<T> = SelfOptions<T> & SuperOptions;

export default class WOASRadioButtonGroup<T> extends VerticalAquaRadioButtonGroup<T> {
  public constructor( property: PhetioProperty<T>, tandem: Tandem, providedOptions?: WOASRadioButtonGroupOptions<T> ) {
    const options = optionize<WOASRadioButtonGroupOptions<T>, SelfOptions<T>, SuperOptions>()( {
      spacing: 10,
      touchAreaXDilation: 10,
      tandem: tandem
    }, providedOptions );

    const length = options.radio.length;
    const group = [];

    for ( let i = 0; i < length; i++ ) {
      group.push( {
        createNode: () => new Text( options.text[ i ], {
          font: NORMAL_FONT,
          maxWidth: 330
        } ),
        value: options.radio[ i ],
        tandemName: options.tandemNames[ i ],
        accessibleName: options.accessibleNames[ i ]
      } );
    }

    super( property, group, options );
  }
}

waveOnAString.register( 'WOASRadioButtonGroup', WOASRadioButtonGroup );