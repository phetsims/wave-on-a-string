// Copyright 2022-2024, University of Colorado Boulder

/**
 * The keyboard help content for the Wave on a String sim.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import waveOnAString from '../../waveOnAString.js';
import RestartButton from './RestartButton.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';

export default class WOASKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  // consistent line wrap for long text in sections of this content
  public static readonly LABEL_LINE_WRAP = 175;

  public constructor() {

    // sim-specific help content about how to interact with the shape
    const moveShapeHelpSection = new WOASHelpSection();
    // KeyboardHelpSection.alignHelpSectionIcons( [ moveShapeHelpSection, shapeShortcutsHelpSection ] );
    const leftContent = [ moveShapeHelpSection ];

    const rightContent = [ new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } ) ];

    super( leftContent, rightContent );
  }
}

class WOASHelpSection extends KeyboardHelpSection {
  public constructor() {

    const restartStringRow = KeyboardHelpSectionRow.fromHotkeyData( RestartButton.RESTART_HOTKEY_DATA, {
      labelWithIconOptions: {
        labelOptions: {
          lineWrap: WOASKeyboardHelpContent.LABEL_LINE_WRAP
        }
      }
    } );

    const contents: KeyboardHelpSectionRow[] = [
      restartStringRow
    ];

    super( WaveOnAStringFluent.keyboardHelpDialog.simulationShortcutsStringProperty, contents );
  }

  public static readonly LABEL_LINE_WRAP = 175;
}

waveOnAString.register( 'WOASKeyboardHelpContent', WOASKeyboardHelpContent );