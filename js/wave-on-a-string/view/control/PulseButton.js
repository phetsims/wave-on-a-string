// Copyright 2013-2019, University of Colorado Boulder

/**
 * Button that starts a pulse
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Shape = require( 'KITE/Shape' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );

  class PulseButton extends RoundPushButton {
    /**
     * @param {WOASModel} model
     * @param {Object} [options]
     */
    constructor( model, options ) {
      const pulseShape = new Shape().moveTo( -9, 0 ).lineTo( -3.5, 0 ).lineTo( 0, -10 ).lineTo( 3.5, 0 ).lineTo( 9, 0 );

      super( {
        listener: function() {
          model.manualPulse();
          model.playProperty.value = true;
          model.yNowChanged.emit();
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
        yContentOffset: -1
      } );

      this.touchArea = this.localBounds.dilatedXY( 5, 10 );

      model.modeProperty.link( mode => {
        this.visible = mode === WOASModel.Mode.PULSE;
      } );

      this.mutate( options );
    }
  }

  return waveOnAString.register( 'PulseButton', PulseButton );
} );
