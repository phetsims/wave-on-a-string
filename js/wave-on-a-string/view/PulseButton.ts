// Copyright 2013-2025, University of Colorado Boulder

/**
 * Button that starts a pulse
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../../sun/js/buttons/RoundPushButton.js';
import waveOnAString from '../../waveOnAString.js';
import type WOASModel from '../model/WOASModel.js';
import { WOASMode } from '../model/WOASMode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WOASColors from './WOASColors.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';

export default class PulseButton extends RoundPushButton {
  public constructor( model: WOASModel, providedOptions?: RoundPushButtonOptions ) {
    const pulseShape = new Shape().moveTo( -9, 0 ).lineTo( -3.5, 0 ).lineTo( 0, -10 ).lineTo( 3.5, 0 ).lineTo( 9, 0 );

    super( optionize<RoundPushButtonOptions, EmptySelfOptions>()( {
      listener: () => {
        model.manualPulse();
        model.isPlayingProperty.value = true;
        model.yNowChangedEmitter.emit();
      },
      baseColor: WOASColors.pulseButtonColorProperty,
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
      yContentOffset: -1,
      accessibleName: WaveOnAStringFluent.a11y.pulseGenerator.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.pulseGenerator.accessibleHelpTextStringProperty
    }, providedOptions ) );

    this.touchArea = this.localBounds.dilatedXY( 5, 10 );

    model.waveModeProperty.link( mode => {
      this.visible = mode === WOASMode.PULSE;
    } );
  }
}

waveOnAString.register( 'PulseButton', PulseButton );