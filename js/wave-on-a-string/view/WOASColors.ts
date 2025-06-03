// Copyright 2025, University of Colorado Boulder

/**
 * Colors for the WOAS simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Color from '../../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import waveOnAString from '../../waveOnAString.js';

const WOASColors = {
  backgroundColorProperty: new ProfileColorProperty( waveOnAString, 'backgroundColor', { default: new Color( '#FFFFB7' ) } ),

  numberDisplayBackgroundStrokeProperty: new ProfileColorProperty( waveOnAString, 'numberDisplayBackgroundStroke', { default: Color.BLACK } ),

  sliderTrackFillProperty: new ProfileColorProperty( waveOnAString, 'sliderTrackFill', { default: Color.BLACK } ),
  sliderThumbFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbFill', { default: new Color( 'hsl(210,50%,63%)' ) } ),
  sliderThumbHighlightedFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbHighlightedFill', { default: new Color( 'hsl(210,70%,73%)' ) } )
};

waveOnAString.register( 'WOASColors', WOASColors );

export default WOASColors;