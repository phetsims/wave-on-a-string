// Copyright 2025, University of Colorado Boulder

/**
 * The keyboard help content for the Wave on a String sim.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import waveOnAString from '../../waveOnAString.js';
import RestartButton from './RestartButton.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';

export default class WOASKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    const LABEL_LINE_WRAP = 175;

    const stringControlsSection = new KeyboardHelpSection( WaveOnAStringFluent.keyboardHelpDialog.stringControlsStringProperty, [
      KeyboardHelpSectionRow.fromHotkeyData( RestartButton.RESTART_HOTKEY_DATA, {
        labelWithIconOptions: {
          labelOptions: {
            lineWrap: LABEL_LINE_WRAP
          }
        }
      } )
    ] );

    const leftContent = [
      stringControlsSection,
      new MoveDraggableItemsKeyboardHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    const rightContent = [
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } ),
      new TimeControlsKeyboardHelpSection()
    ];

    super( leftContent, rightContent );
  }
}

waveOnAString.register( 'WOASKeyboardHelpContent', WOASKeyboardHelpContent );