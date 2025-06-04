// Copyright 2025, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringStrings from '../../WaveOnAStringStrings.js';
import { NORMAL_FONT } from '../WOASConstants.js';

export default class RestartButton extends TextPushButton {
  public constructor( callback: () => void, providedOptions?: TextPushButtonOptions ) {

    super( WaveOnAStringStrings.restartStringProperty, optionize<TextPushButtonOptions, EmptySelfOptions>()( {
      listener: callback,
      font: NORMAL_FONT,
      baseColor: 'hsl(210,0%,85%)',
      maxTextWidth: 250
    }, providedOptions ) );

    // NOTE: get rid of this
    this.touchArea = this.localBounds.dilatedXY( 5, 20 );
  }
}

waveOnAString.register( 'RestartButton', RestartButton );