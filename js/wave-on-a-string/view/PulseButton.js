// Copyright 2013-2021, University of Colorado Boulder

/**
 * Button that starts a pulse
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import WOASModel from '../model/WOASModel.js';

class PulseButton extends RoundPushButton {
  /**
   * @param {WOASModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    const pulseShape = new Shape().moveTo( -9, 0 ).lineTo( -3.5, 0 ).lineTo( 0, -10 ).lineTo( 3.5, 0 ).lineTo( 9, 0 );

    super( merge( {
      listener: () => {
        model.manualPulse();
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      baseColor: '#33dd33',
      content: new Node( {
        children: [
          new Path( pulseShape, {
            lineWidth: 3,
            stroke: '#eee',
            lineCap: 'round'
          } ),
          new Path( pulseShape, {
            lineWidth: 1.5,
            stroke: '#333',
            lineCap: 'round'
          } )
        ]
      } ),
      radius: 17,
      xMargin: 6,
      yMargin: 6,
      yContentOffset: -1
    }, options ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 10 );

    model.waveModeProperty.link( mode => {
      this.visible = mode === WOASModel.Mode.PULSE;
    } );
  }
}

waveOnAString.register( 'PulseButton', PulseButton );
export default PulseButton;