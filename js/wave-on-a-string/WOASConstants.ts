// Copyright 2025, University of Colorado Boulder

/**
 * Constants helpful for the Wave on a String simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';

export const MAX_START_AMPLITUDE_CM = 1.3;
export const NUMBER_OF_BEADS = 61;
export const MODEL_UNITS_PER_CM = 80;
export const FRAMES_PER_SECOND = 50;
export const FRAME_DURATION = 1 / FRAMES_PER_SECOND;
export const VIEW_ORIGIN_X = 150;
export const VIEW_ORIGIN_Y = 265;
export const MODEL_UNITS_PER_GAP = 10;
export const SCALE_FROM_ORIGINAL = 1.25;
export const VIEW_END_X = VIEW_ORIGIN_X + SCALE_FROM_ORIGINAL * ( ( NUMBER_OF_BEADS - 1 ) * MODEL_UNITS_PER_GAP );

export const NORMAL_FONT = new PhetFont( 16 );
export const HEADER_FONT = new PhetFont( {
  size: 16,
  weight: 'bold'
} );

export const dilatedTouchArea = 10;
export const dilatedReferenceLineTouchArea = 20;

export const postGradient = new LinearGradient( -5, 0, 5, 0 )
  .addColorStop( 0, '#666' )
  .addColorStop( 0.3, '#FFF' )
  .addColorStop( 1, '#666' );

export const referenceLineBlockGradient = new LinearGradient( 0, -10, 0, 20 )
  .addColorStop( 0, '#78571C' )
  .addColorStop( 0.3, '#D3B072' )
  .addColorStop( 1, '#78571C' );

// {number} - window image scale
export const windowScale = 0.6;

// {number} - how much the window front should overlap the window back
export const windowXOffset = 5;

// {number} - how much to horizontally shift the window (to center)
export const windowShift = 1;

export const offsetWheel = new Vector2( 0, 150 );