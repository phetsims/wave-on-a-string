// Copyright 2025, University of Colorado Boulder

/**
 * Constants helpful for the Wave on a String simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';

export const NUMBER_OF_BEADS = 61;
export const MODEL_UNITS_PER_CM = 80;
export const FRAMES_PER_SECOND = 50;
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