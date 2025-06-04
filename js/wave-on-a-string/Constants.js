// Copyright 2013-2025, University of Colorado Boulder

/**
 * @author Anton Ulyanov (Mlearner)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import waveOnAString from '../waveOnAString.js';

const Constants = {
  dilatedTouchArea: 10,
  dilatedReferenceLineTouchArea: 20,

  postGradient: new LinearGradient( -5, 0, 5, 0 )
    .addColorStop( 0, '#666' )
    .addColorStop( 0.3, '#FFF' )
    .addColorStop( 1, '#666' ),
  referenceLineBlockGradient: new LinearGradient( 0, -10, 0, 20 )
    .addColorStop( 0, '#78571C' )
    .addColorStop( 0.3, '#D3B072' )
    .addColorStop( 1, '#78571C' ),

  // {number} - window image scale
  windowScale: 0.6,

  // {number} - how much the window front should overlap the window back
  windowXOffset: 5,

  // {number} - how much to horizontally shift the window (to center)
  windowShift: 1,

  offsetWheel: new Vector2( 0, 150 )
};

waveOnAString.register( 'Constants', Constants );
export default Constants;