// Copyright 2025, University of Colorado Boulder

/**
 * Determines what mode the Wave on a String simulation is in.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';

export class WOASMode extends EnumerationValue {
  public static readonly MANUAL = new WOASMode();
  public static readonly OSCILLATE = new WOASMode();
  public static readonly PULSE = new WOASMode();

  public static readonly enumeration = new Enumeration( WOASMode );
}