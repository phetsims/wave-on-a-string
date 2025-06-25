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
addToMapIfDefined( 'a11y_headings_playArea_activeMeasurementTools', 'a11y.headings.playArea.activeMeasurementToolsStringProperty' );
addToMapIfDefined( 'a11y_headings_playArea_activeMeasurementToolsDescription', 'a11y.headings.playArea.activeMeasurementToolsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_headings_playArea_waveAndStringProperties', 'a11y.headings.playArea.waveAndStringPropertiesStringProperty' );
addToMapIfDefined( 'a11y_headings_playArea_waveAndStringPropertiesDescription', 'a11y.headings.playArea.waveAndStringPropertiesDescriptionStringProperty' );
addToMapIfDefined( 'a11y_headings_controlArea_measurementTools', 'a11y.headings.controlArea.measurementToolsStringProperty' );
addToMapIfDefined( 'a11y_headings_controlArea_measurementToolsDescription', 'a11y.headings.controlArea.measurementToolsDescriptionStringProperty' );
addToMapIfDefined( 'a11y_waveMode_accessibleName', 'a11y.waveMode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveMode_accessibleHelpText', 'a11y.waveMode.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_waveMode_manual_accessibleName', 'a11y.waveMode.manual.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveMode_oscillate_accessibleName', 'a11y.waveMode.oscillate.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_waveMode_pulse_accessibleName', 'a11y.waveMode.pulse.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_endMode_accessibleName', 'a11y.endMode.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_endMode_accessibleHelpText', 'a11y.endMode.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_endMode_fixedEnd_accessibleName', 'a11y.endMode.fixedEnd.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_endMode_looseEnd_accessibleName', 'a11y.endMode.looseEnd.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_endMode_noEnd_accessibleName', 'a11y.endMode.noEnd.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_wrench_accessibleName', 'a11y.wrench.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_wrench_accessibleHelpText', 'a11y.wrench.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_pulseGenerator_accessibleName', 'a11y.pulseGenerator.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_pulseGenerator_accessibleHelpText', 'a11y.pulseGenerator.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_restartButton_accessibleHelpText', 'a11y.restartButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_horizontalRuler_accessibleName', 'a11y.horizontalRuler.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_horizontalRuler_accessibleHelpText', 'a11y.horizontalRuler.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_verticalRuler_accessibleName', 'a11y.verticalRuler.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_verticalRuler_accessibleHelpText', 'a11y.verticalRuler.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_stopwatch_accessibleHelpText', 'a11y.stopwatch.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleName', 'a11y.referenceLine.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_referenceLine_accessibleHelpText', 'a11y.referenceLine.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_amplitudeControl_accessibleHelpText', 'a11y.amplitudeControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_frequencyControl_accessibleHelpText', 'a11y.frequencyControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_pulseWidthControl_accessibleHelpText', 'a11y.pulseWidthControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_dampingControl_accessibleHelpText', 'a11y.dampingControl.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_tensionControl_accessibleHelpText', 'a11y.tensionControl.accessibleHelpTextStringProperty' );

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
    },
    headings: {
      playArea: {
        activeMeasurementToolsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_playArea_activeMeasurementTools', _.get( WaveOnAStringStrings, 'a11y.headings.playArea.activeMeasurementToolsStringProperty' ) ),
        activeMeasurementToolsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_playArea_activeMeasurementToolsDescription', _.get( WaveOnAStringStrings, 'a11y.headings.playArea.activeMeasurementToolsDescriptionStringProperty' ) ),
        waveAndStringPropertiesStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_playArea_waveAndStringProperties', _.get( WaveOnAStringStrings, 'a11y.headings.playArea.waveAndStringPropertiesStringProperty' ) ),
        waveAndStringPropertiesDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_playArea_waveAndStringPropertiesDescription', _.get( WaveOnAStringStrings, 'a11y.headings.playArea.waveAndStringPropertiesDescriptionStringProperty' ) )
      },
      controlArea: {
        measurementToolsStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_controlArea_measurementTools', _.get( WaveOnAStringStrings, 'a11y.headings.controlArea.measurementToolsStringProperty' ) ),
        measurementToolsDescriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_headings_controlArea_measurementToolsDescription', _.get( WaveOnAStringStrings, 'a11y.headings.controlArea.measurementToolsDescriptionStringProperty' ) )
      }
    },
    waveMode: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveMode_accessibleName', _.get( WaveOnAStringStrings, 'a11y.waveMode.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveMode_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.waveMode.accessibleHelpTextStringProperty' ) ),
      manual: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveMode_manual_accessibleName', _.get( WaveOnAStringStrings, 'a11y.waveMode.manual.accessibleNameStringProperty' ) )
      },
      oscillate: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveMode_oscillate_accessibleName', _.get( WaveOnAStringStrings, 'a11y.waveMode.oscillate.accessibleNameStringProperty' ) )
      },
      pulse: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_waveMode_pulse_accessibleName', _.get( WaveOnAStringStrings, 'a11y.waveMode.pulse.accessibleNameStringProperty' ) )
      }
    },
    endMode: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_endMode_accessibleName', _.get( WaveOnAStringStrings, 'a11y.endMode.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_endMode_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.endMode.accessibleHelpTextStringProperty' ) ),
      fixedEnd: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_endMode_fixedEnd_accessibleName', _.get( WaveOnAStringStrings, 'a11y.endMode.fixedEnd.accessibleNameStringProperty' ) )
      },
      looseEnd: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_endMode_looseEnd_accessibleName', _.get( WaveOnAStringStrings, 'a11y.endMode.looseEnd.accessibleNameStringProperty' ) )
      },
      noEnd: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_endMode_noEnd_accessibleName', _.get( WaveOnAStringStrings, 'a11y.endMode.noEnd.accessibleNameStringProperty' ) )
      }
    },
    wrench: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_wrench_accessibleName', _.get( WaveOnAStringStrings, 'a11y.wrench.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_wrench_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.wrench.accessibleHelpTextStringProperty' ) )
    },
    pulseGenerator: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_pulseGenerator_accessibleName', _.get( WaveOnAStringStrings, 'a11y.pulseGenerator.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_pulseGenerator_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.pulseGenerator.accessibleHelpTextStringProperty' ) )
    },
    restartButton: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_restartButton_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.restartButton.accessibleHelpTextStringProperty' ) )
    },
    horizontalRuler: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalRuler_accessibleName', _.get( WaveOnAStringStrings, 'a11y.horizontalRuler.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_horizontalRuler_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.horizontalRuler.accessibleHelpTextStringProperty' ) )
    },
    verticalRuler: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_verticalRuler_accessibleName', _.get( WaveOnAStringStrings, 'a11y.verticalRuler.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_verticalRuler_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.verticalRuler.accessibleHelpTextStringProperty' ) )
    },
    stopwatch: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_stopwatch_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.stopwatch.accessibleHelpTextStringProperty' ) )
    },
    referenceLine: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleName', _.get( WaveOnAStringStrings, 'a11y.referenceLine.accessibleNameStringProperty' ) ),
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_referenceLine_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.referenceLine.accessibleHelpTextStringProperty' ) )
    },
    amplitudeControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_amplitudeControl_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.amplitudeControl.accessibleHelpTextStringProperty' ) )
    },
    frequencyControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyControl_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.frequencyControl.accessibleHelpTextStringProperty' ) )
    },
    pulseWidthControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_pulseWidthControl_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.pulseWidthControl.accessibleHelpTextStringProperty' ) )
    },
    dampingControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_dampingControl_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.dampingControl.accessibleHelpTextStringProperty' ) )
    },
    tensionControl: {
      accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_tensionControl_accessibleHelpText', _.get( WaveOnAStringStrings, 'a11y.tensionControl.accessibleHelpTextStringProperty' ) )
    }
  }
};

export default WaveOnAStringFluent;

waveOnAString.register('WaveOnAStringFluent', WaveOnAStringFluent);
