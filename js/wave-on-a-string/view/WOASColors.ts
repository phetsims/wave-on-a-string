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
  panelBackgroundColorProperty: new ProfileColorProperty( waveOnAString, 'panelBackgroundColor', { default: new Color( '#D9FCC5' ) } ),

  numberDisplayBackgroundStrokeProperty: new ProfileColorProperty( waveOnAString, 'numberDisplayBackgroundStroke', { default: Color.BLACK } ),

  sliderTrackFillProperty: new ProfileColorProperty( waveOnAString, 'sliderTrackFill', { default: Color.BLACK } ),
  sliderThumbFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbFill', { default: new Color( 'hsl(210,50%,63%)' ) } ),
  sliderThumbHighlightedFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbHighlightedFill', { default: new Color( 'hsl(210,70%,73%)' ) } ),

  stringPathColorProperty: new ProfileColorProperty( waveOnAString, 'stringPathColor', { default: new Color( '#F00' ) } ),
  regularBeadFillProperty: new ProfileColorProperty( waveOnAString, 'regularBeadFill', { default: new Color( 'red' ) } ),
  referenceBeadFillProperty: new ProfileColorProperty( waveOnAString, 'referenceBeadFill', { default: new Color( 'rgb(0,0,255)' ) } ),
  beadStrokeProperty: new ProfileColorProperty( waveOnAString, 'beadStroke', { default: Color.BLACK } ),
  beadHighlightFillProperty: new ProfileColorProperty( waveOnAString, 'beadHighlightFill', { default: new Color( 'white' ) } ),

  pulseButtonColorProperty: new ProfileColorProperty( waveOnAString, 'pulseButtonColor', { default: new Color( '#33dd33' ) } ),
  restartButtonColorProperty: new ProfileColorProperty( waveOnAString, 'restartButtonColor', { default: new Color( 'hsl(210,0%,85%)' ) } ),

  wrenchArrowColorProperty: new ProfileColorProperty( waveOnAString, 'wrenchArrowColor', { default: new Color( 'hsl(210,90%,60%)' ) } )
};

waveOnAString.register( 'WOASColors', WOASColors );

export default WOASColors;