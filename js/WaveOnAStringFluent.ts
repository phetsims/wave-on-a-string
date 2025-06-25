// Copyright 2025, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from wave-on-a-string-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import type { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import waveOnAString from './waveOnAString.js';
import WaveOnAStringStrings from './WaveOnAStringStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( WaveOnAStringStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'wave_on_a_string_title', 'wave-on-a-string.titleStringProperty' );
addToMapIfDefined( 'rulers', 'rulersStringProperty' );
addToMapIfDefined( 'timer', 'timerStringProperty' );
addToMapIfDefined( 'amplitude', 'amplitudeStringProperty' );
addToMapIfDefined( 'frequency', 'frequencyStringProperty' );
addToMapIfDefined( 'pulseWidth', 'pulseWidthStringProperty' );
addToMapIfDefined( 'damping', 'dampingStringProperty' );
addToMapIfDefined( 'tension', 'tensionStringProperty' );
addToMapIfDefined( 'low', 'lowStringProperty' );
addToMapIfDefined( 'high', 'highStringProperty' );
addToMapIfDefined( 'manual', 'manualStringProperty' );
addToMapIfDefined( 'oscillate', 'oscillateStringProperty' );
addToMapIfDefined( 'pulse', 'pulseStringProperty' );
addToMapIfDefined( 'restart', 'restartStringProperty' );
addToMapIfDefined( 'fixedEnd', 'fixedEndStringProperty' );
addToMapIfDefined( 'looseEnd', 'looseEndStringProperty' );
addToMapIfDefined( 'noEnd', 'noEndStringProperty' );
addToMapIfDefined( 'speedNormal', 'speedNormalStringProperty' );
addToMapIfDefined( 'speedSlow', 'speedSlowStringProperty' );
addToMapIfDefined( 'referenceLine', 'referenceLineStringProperty' );
addToMapIfDefined( 'unitCm', 'unitCmStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_playArea', 'a11y.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_controlArea', 'a11y.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_currentDetails_start', 'a11y.screenSummary.currentDetails.startStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_currentDetails_end', 'a11y.screenSummary.currentDetails.endStringProperty' );
addToMapIfDefined( 'a11y_screenSummary_interactionHint', 'a11y.screenSummary.interactionHintStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${stringProperty.value}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const WaveOnAStringFluent = {
  "wave-on-a-string": {
    _comment_0: new FluentComment( {"comment":"Strings for the Wave on a String simulation.","associatedKey":"wave-on-a-string.title"} ),
    _comment_1: new FluentComment( {"comment":"After changing this file, run `grunt modulify --targets=strings` to regenerate the appropriate files, including type definitions.","associatedKey":"wave-on-a-string.title"} ),
    titleStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'wave_on_a_string_title', _.get( WaveOnAStringStrings, 'wave-on-a-string.titleStringProperty' ) )
  },
  rulersStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'rulers', _.get( WaveOnAStringStrings, 'rulersStringProperty' ) ),
  timerStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'timer', _.get( WaveOnAStringStrings, 'timerStringProperty' ) ),
  amplitudeStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'amplitude', _.get( WaveOnAStringStrings, 'amplitudeStringProperty' ) ),
  frequencyStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'frequency', _.get( WaveOnAStringStrings, 'frequencyStringProperty' ) ),
  pulseWidthStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pulseWidth', _.get( WaveOnAStringStrings, 'pulseWidthStringProperty' ) ),
  dampingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'damping', _.get( WaveOnAStringStrings, 'dampingStringProperty' ) ),
  tensionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'tension', _.get( WaveOnAStringStrings, 'tensionStringProperty' ) ),
  lowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'low', _.get( WaveOnAStringStrings, 'lowStringProperty' ) ),
  highStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'high', _.get( WaveOnAStringStrings, 'highStringProperty' ) ),
  manualStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'manual', _.get( WaveOnAStringStrings, 'manualStringProperty' ) ),
  oscillateStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'oscillate', _.get( WaveOnAStringStrings, 'oscillateStringProperty' ) ),
  pulseStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'pulse', _.get( WaveOnAStringStrings, 'pulseStringProperty' ) ),
  restartStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'restart', _.get( WaveOnAStringStrings, 'restartStringProperty' ) ),
  fixedEndStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'fixedEnd', _.get( WaveOnAStringStrings, 'fixedEndStringProperty' ) ),
  looseEndStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'looseEnd', _.get( WaveOnAStringStrings, 'looseEndStringProperty' ) ),
  noEndStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'noEnd', _.get( WaveOnAStringStrings, 'noEndStringProperty' ) ),
  speedNormalStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'speedNormal', _.get( WaveOnAStringStrings, 'speedNormalStringProperty' ) ),
  speedSlowStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'speedSlow', _.get( WaveOnAStringStrings, 'speedSlowStringProperty' ) ),
  referenceLineStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'referenceLine', _.get( WaveOnAStringStrings, 'referenceLineStringProperty' ) ),
  unitCmStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'unitCm', _.get( WaveOnAStringStrings, 'unitCmStringProperty' ) ),
  patternValueUnitHzStringProperty: _.get( WaveOnAStringStrings, 'patternValueUnitHzStringProperty' ),
  patternValueUnitCmStringProperty: _.get( WaveOnAStringStrings, 'patternValueUnitCmStringProperty' ),
  patternValueUnitSStringProperty: _.get( WaveOnAStringStrings, 'patternValueUnitSStringProperty' ),
  patternValueUnitPercentageStringProperty: _.get( WaveOnAStringStrings, 'patternValueUnitPercentageStringProperty' ),
  a11y: {
    screenSummary: {
      playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screenSummary_playArea', _.get( WaveOnAStringStrings, 'a11y.screenSummary.playAreaStringProperty' ) ),
      controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screenSummary_controlArea', _.get( WaveOnAStringStrings, 'a11y.screenSummary.controlAreaStringProperty' ) ),
      currentDetails: {
        start: new FluentPattern<{ isPlaying: 'false' | 'true' | TReadOnlyProperty<'false' | 'true'>, wrenchPosition: 'bottom' | 'middle' | 'top' | TReadOnlyProperty<'bottom' | 'middle' | 'top'> }>( fluentSupport.bundleProperty, 'a11y_screenSummary_currentDetails_start', _.get( WaveOnAStringStrings, 'a11y.screenSummary.currentDetails.startStringProperty' ), [{"name":"isPlaying","variants":["false","true"]},{"name":"wrenchPosition","variants":["bottom","middle","top"]}] ),
        end: new FluentPattern<{ endPosition: 'fixed' | 'loose' | 'no' | TReadOnlyProperty<'fixed' | 'loose' | 'no'> }>( fluentSupport.bundleProperty, 'a11y_screenSummary_currentDetails_end', _.get( WaveOnAStringStrings, 'a11y.screenSummary.currentDetails.endStringProperty' ), [{"name":"endPosition","variants":["fixed","loose","no"]}] )
      },
      interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_screenSummary_interactionHint', _.get( WaveOnAStringStrings, 'a11y.screenSummary.interactionHintStringProperty' ) )
    }
  }
};

export default WaveOnAStringFluent;

waveOnAString.register('WaveOnAStringFluent', WaveOnAStringFluent);
