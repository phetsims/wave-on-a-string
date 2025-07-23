// Copyright 2025, University of Colorado Boulder

/**
 * Colors for the WOAS simulation.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Color from '../../../../scenery/js/util/Color.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import waveOnAString from '../../waveOnAString.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';

const WOASColors = {
  backgroundColorProperty: new ProfileColorProperty( waveOnAString, 'backgroundColor', { default: new Color( '#FFFFB7' ) } ),
  panelBackgroundColorProperty: new ProfileColorProperty( waveOnAString, 'panelBackgroundColor', { default: new Color( '#D9FCC5' ) } ),

  numberDisplayBackgroundStrokeProperty: new ProfileColorProperty( waveOnAString, 'numberDisplayBackgroundStroke', { default: Color.BLACK } ),

  sliderTrackFillProperty: new ProfileColorProperty( waveOnAString, 'sliderTrackFill', { default: Color.BLACK } ),
  sliderThumbFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbFill', { default: new Color( 'hsl(210,50%,63%)' ) } ),
  sliderThumbHighlightedFillProperty: new ProfileColorProperty( waveOnAString, 'sliderThumbHighlightedFill', { default: new Color( 'hsl(210,70%,73%)' ) } ),

  stringPathColorProperty: new ProfileColorProperty( waveOnAString, 'stringPathColor', { default: new Color( '#F00' ) } ),
  regularBeadFillProperty: new ProfileColorProperty( waveOnAString, 'regularBeadFill', { default: new Color( 'red' ) } ),
  referenceBeadFillProperty: new ProfileColorProperty( waveOnAString, 'referenceBeadFill', { default: new Color( 'rgb(128,243,255)' ) } ),
  beadStrokeProperty: new ProfileColorProperty( waveOnAString, 'beadStroke', { default: Color.BLACK } ),
  beadHighlightFillProperty: new ProfileColorProperty( waveOnAString, 'beadHighlightFill', { default: new Color( 'white' ) } ),

  pulseButtonColorProperty: new ProfileColorProperty( waveOnAString, 'pulseButtonColor', { default: new Color( '#33dd33' ) } ),
  restartButtonColorProperty: new ProfileColorProperty( waveOnAString, 'restartButtonColor', { default: ColorConstants.LIGHT_BLUE } ),

  wrenchArrowColorProperty: new ProfileColorProperty( waveOnAString, 'wrenchArrowColor', { default: new Color( 'hsl(210,90%,60%)' ) } ),

  referenceLineColorProperty: new ProfileColorProperty( waveOnAString, 'referenceLineColor', { default: new Color( '#F00' ) } ),
  referenceLineHandleOutsideColorProperty: new ProfileColorProperty( waveOnAString, 'referenceLineHandleOutsideColor', { default: new Color( '#78571C' ) } ),
  referenceLineHandleInsideColorProperty: new ProfileColorProperty( waveOnAString, 'referenceLineHandleInsideColor', { default: new Color( '#D3B072' ) } ),

  postOutsideColorProperty: new ProfileColorProperty( waveOnAString, 'postOutsideColor', { default: new Color( '#666' ) } ),
  postInsideColorProperty: new ProfileColorProperty( waveOnAString, 'postInsideColor', { default: new Color( '#FFF' ) } )
};

waveOnAString.register( 'WOASColors', WOASColors );

export default WOASColors;