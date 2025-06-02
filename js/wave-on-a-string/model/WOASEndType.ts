// Copyright 2025, University of Colorado Boulder

/**
 * Enumeration for the end type of the wave on a string simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

export class WOASEndType extends EnumerationValue {
  public static readonly FIXED_END = new WOASEndType();
  public static readonly LOOSE_END = new WOASEndType();
  public static readonly NO_END = new WOASEndType();

  public static readonly enumeration = new Enumeration( WOASEndType );
}