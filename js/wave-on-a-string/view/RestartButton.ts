// Copyright 2025, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RestartUndoButton, { RestartUndoButtonOptions } from '../../../../scenery-phet/js/buttons/RestartUndoButton.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import WOASColors from './WOASColors.js';

export default class RestartButton extends RestartUndoButton {
  public constructor( callback: () => void, providedOptions?: RestartUndoButtonOptions ) {

    super( optionize<RestartUndoButtonOptions, EmptySelfOptions>()( {
      listener: callback,
      baseColor: WOASColors.restartButtonColorProperty,
      accessibleName: WaveOnAStringFluent.restartStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.restartButton.accessibleHelpTextStringProperty,
      touchAreaXDilation: 15,
      touchAreaYDilation: 15
    }, providedOptions ) );
  }
}

waveOnAString.register( 'RestartButton', RestartButton );