// Copyright 2025, University of Colorado Boulder

/**
 * Control WOASRadioButtonGroup view
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import { NORMAL_FONT } from '../WOASConstants.js';

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
    const group: AquaRadioButtonGroupItem<T>[] = [];

    for ( let i = 0; i < length; i++ ) {
      group.push( {
        createNode: () => new Text( options.text[ i ], {
          font: NORMAL_FONT,
          maxWidth: 330
        } ),
        value: options.radio[ i ],
        tandemName: options.tandemNames[ i ],

        // TODO: this failed type checking when I made group of type AquaRadioButtonGroupItem<T> see https://github.com/phetsims/wave-on-a-string/issues/177
        // @ts-expect-error see https://github.com/phetsims/wave-on-a-string/issues/177
        accessibleName: options.accessibleNames[ i ]
      } );
    }

    super( property, group, options );
  }
}

waveOnAString.register( 'WOASRadioButtonGroup', WOASRadioButtonGroup );