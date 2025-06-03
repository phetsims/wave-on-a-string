// Copyright 2025, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringStrings from '../../WaveOnAStringStrings.js';

export default class RestartButton extends TextPushButton {
  public constructor( callback: () => void, providedOptions?: TextPushButtonOptions ) {

    super( WaveOnAStringStrings.restartStringProperty, optionize<TextPushButtonOptions, EmptySelfOptions>()( {
      listener: callback,
      font: new PhetFont( 12 ),
      baseColor: 'hsl(210,0%,85%)',
      maxTextWidth: 250
    }, providedOptions ) );

    // NOTE: get rid of this
    this.touchArea = this.localBounds.dilatedXY( 5, 20 );
  }
}

waveOnAString.register( 'RestartButton', RestartButton );