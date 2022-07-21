// Copyright 2013-2022, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import waveOnAStringStrings from '../../waveOnAStringStrings.js';

const restartString = waveOnAStringStrings.restart;

class RestartButton extends TextPushButton {
  /**
   * @param {function} callback
   * @param {Object} [options]
   */
  constructor( callback, options ) {

    super( restartString, merge( {
      listener: callback,
      font: new PhetFont( 12 ),
      baseColor: 'hsl(210,0%,85%)',
      maxWidth: 250
    }, options ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 20 );
  }
}

waveOnAString.register( 'RestartButton', RestartButton );
export default RestartButton;