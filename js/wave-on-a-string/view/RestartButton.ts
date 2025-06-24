// Copyright 2025, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import { NORMAL_FONT } from '../WOASConstants.js';
import WOASColors from './WOASColors.js';

export default class RestartButton extends TextPushButton {
  public constructor( callback: () => void, providedOptions?: TextPushButtonOptions ) {

    super( WaveOnAStringFluent.restartStringProperty, optionize<TextPushButtonOptions, EmptySelfOptions>()( {
      listener: callback,
      font: NORMAL_FONT,
      baseColor: WOASColors.restartButtonColorProperty,
      maxTextWidth: 250
    }, providedOptions ) );

    // NOTE: get rid of this
    this.touchArea = this.localBounds.dilatedXY( 5, 20 );
  }
}

waveOnAString.register( 'RestartButton', RestartButton );