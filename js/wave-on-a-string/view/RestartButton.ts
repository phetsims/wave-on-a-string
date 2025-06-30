// Copyright 2025, University of Colorado Boulder

/**
 * Restart button
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RestartUndoButton, { RestartUndoButtonOptions } from '../../../../scenery-phet/js/buttons/RestartUndoButton.js';
import TextKeyNode from '../../../../scenery-phet/js/keyboard/TextKeyNode.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
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

    // Global key listeners
    KeyboardListener.createGlobal( this, {
      keyStringProperties: RestartButton.RESTART_HOTKEY_DATA.keyStringProperties,
      fire: () => {
        this.pdomClick();
      }
    } );
  }

  public static readonly RESTART_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'alt+shift+r' ) ],
    keyboardHelpDialogLabelStringProperty: WaveOnAStringFluent.restartStringProperty,
    keyboardHelpDialogPDOMLabelStringProperty: WaveOnAStringFluent.a11y.keyboardHelpDialog.restartString.description.createProperty( {
      altOrOption: TextKeyNode.getAltKeyString()
    } ),
    global: true,
    repoName: waveOnAString.name
  } );
}

waveOnAString.register( 'RestartButton', RestartButton );