// Copyright 2014-2025, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Screen from '../../../../joist/js/Screen.js';
import waveOnAString from '../../waveOnAString.js';
import WOASModel from '../model/WOASModel.js';
import WOASScreenView from './WOASScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import WOASColors from './WOASColors.js';
import WOASKeyboardHelpContent from './WOASKeyboardHelpContent.js';

export default class WOASScreen extends Screen<WOASModel, WOASScreenView> {
  public constructor( tandem: Tandem ) {
    super(
      () => new WOASModel( tandem.createTandem( 'model' ) ),
      model => new WOASScreenView( model, tandem.createTandem( 'view' ) ), {
        backgroundColorProperty: WOASColors.backgroundColorProperty,
        tandem: tandem,
        createKeyboardHelpNode: () => new WOASKeyboardHelpContent()
      } );
  }
}

waveOnAString.register( 'WOASScreen', WOASScreen );