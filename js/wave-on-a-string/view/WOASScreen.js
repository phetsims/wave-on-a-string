// Copyright 2014-2020, University of Colorado Boulder

/**
 * The main screen for Wave on a String
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../../../axon/js/Property.js';
import Screen from '../../../../joist/js/Screen.js';
import waveOnAString from '../../waveOnAString.js';
import WOASModel from '../model/WOASModel.js';
import WOASScreenView from './WOASScreenView.js';

class WOASScreen extends Screen {
  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super(
      () => new WOASModel( tandem.createTandem( 'model' ) ),
      model => new WOASScreenView( model, tandem.createTandem( 'view' ) ), {
        backgroundColorProperty: new Property( '#FFFFB7' ),
        tandem: tandem
      } );
  }
}

waveOnAString.register( 'WOASScreen', WOASScreen );
export default WOASScreen;