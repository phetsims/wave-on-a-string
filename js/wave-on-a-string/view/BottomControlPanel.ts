// Copyright 2013-2025, University of Colorado Boulder

/**
 * Control panel at the bottom of the screen, with many controls in it
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import RangedDynamicProperty from '../../../../axon/js/RangedDynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import type WOASModel from '../model/WOASModel.js';
import WOASNumberControl from './WOASNumberControl.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import { WOASMode } from '../model/WOASMode.js';
import { NORMAL_FONT } from '../WOASConstants.js';
import WOASColors from './WOASColors.js';
import Separator from '../../../../scenery/js/layout/nodes/Separator.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import FluentPattern, { FluentVariable } from '../../../../chipper/js/browser/FluentPattern.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

export default class BottomControlPanel extends Panel {
  // for global a11y ordering
  public readonly tensionControl: WOASNumberControl;
  public readonly dampingControl: WOASNumberControl;
  public readonly frequencyControl: WOASNumberControl;
  public readonly pulseWidthControl: WOASNumberControl;
  public readonly amplitudeControl: WOASNumberControl;
  public readonly checkboxGroup: Node;

  public constructor( model: WOASModel, tandem: Tandem ) {
    const checkboxTextOptions = {
      font: NORMAL_FONT,
      maxWidth: 130
    };
    const checkboxTandem = tandem.createTandem( 'checkboxGroup' );
    const checkboxGroup = new VerticalCheckboxGroup( [ {
      createNode: () => new Text( WaveOnAStringFluent.rulersStringProperty, checkboxTextOptions ),
      property: model.rulersVisibleProperty,
      tandemName: 'rulersCheckbox',
      options: {
        accessibleHelpText: WaveOnAStringFluent.a11y.visibilityControls.rulers.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: WaveOnAStringFluent.a11y.visibilityControls.rulers.accessibleContextResponse.createProperty( {
          isVisible: 'true'
        } ),
        accessibleContextResponseUnchecked: WaveOnAStringFluent.a11y.visibilityControls.rulers.accessibleContextResponse.createProperty( {
          isVisible: 'false'
        } )
      }
    }, {
      createNode: () => new Text( WaveOnAStringFluent.timerStringProperty, checkboxTextOptions ),
      property: model.stopwatch.isVisibleProperty,
      tandemName: 'stopwatchCheckbox',
      options: {
        accessibleHelpText: WaveOnAStringFluent.a11y.visibilityControls.stopwatch.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: WaveOnAStringFluent.a11y.visibilityControls.stopwatch.accessibleContextResponse.createProperty( {
          isVisible: 'true'
        } ),
        accessibleContextResponseUnchecked: WaveOnAStringFluent.a11y.visibilityControls.stopwatch.accessibleContextResponse.createProperty( {
          isVisible: 'false'
        } )
      }
    }, {
      createNode: () => new Text( WaveOnAStringFluent.referenceLineStringProperty, checkboxTextOptions ),
      property: model.referenceLineVisibleProperty,
      tandemName: 'referenceLineCheckbox',
      options: {
        accessibleHelpText: WaveOnAStringFluent.a11y.visibilityControls.referenceLine.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: WaveOnAStringFluent.a11y.visibilityControls.referenceLine.accessibleContextResponse.createProperty( {
          isVisible: 'true'
        } ),
        accessibleContextResponseUnchecked: WaveOnAStringFluent.a11y.visibilityControls.referenceLine.accessibleContextResponse.createProperty( {
          isVisible: 'false'
        } )
      }
    } ], {
      tandem: checkboxTandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    const separator = new Separator( {
      x1: 0,
      y1: 10,
      x2: 0,
      y2: 100,
      lineWidth: 1
    } );

    // We convert from a ratio to a percentage (for the view)
    const tensionProperty = new RangedDynamicProperty( new Property( model.tensionProperty ), {
      bidirectional: true,
      map: ( value: number ) => value * 100,
      inverseMap: ( value: number ) => value / 100,
      range: new Range( model.tensionProperty.range.min * 100, model.tensionProperty.range.max * 100 )
    } );
    const dampingProperty = new RangedDynamicProperty( new Property( model.dampingProperty ), {
      bidirectional: true,
      map: ( value: number ) => value * 100,
      inverseMap: ( value: number ) => value / 100,
      range: new Range( model.dampingProperty.range.min * 100, model.dampingProperty.range.max * 100 )
    } );

    // Number formatting for both visual and accessible strings.
    const getNumberDisplayOptions = (
      valuePattern: TReadOnlyProperty<string>,
      accessibleValuePattern: FluentPattern<{ value: FluentVariable }>,
      decimalPlaces: number | null
    ): NumberDisplayOptions => {
      return {
        numberFormatter: ( value: number ) => {
          const valueString = decimalPlaces === null ? StringUtils.wrapLTR( `${value}` ) : StringUtils.toFixedLTR( value, decimalPlaces );

          return {
            valueString: StringUtils.format( valuePattern.value, valueString ),
            accessibleValueString: accessibleValuePattern.format( {
              value: valueString
            } )
          };
        },
        numberFormatterDependencies: [
          valuePattern,
          ...accessibleValuePattern.getDependentProperties()
        ]
      };
    };

    const tensionControl = new WOASNumberControl( WaveOnAStringFluent.tensionStringProperty, tensionProperty, {
      delta: 1,
      numberDisplayOptions: getNumberDisplayOptions(
        WaveOnAStringFluent.patternValueUnitPercentageStringProperty,
        WaveOnAStringFluent.a11y.valuePatterns.percentage,
        0
      ),
      sliderOptions: {
        constrainValue: value => tensionProperty.range.constrainValue( roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'tensionControl' ),
      accessibleHelpText: WaveOnAStringFluent.a11y.tensionControl.accessibleHelpTextStringProperty
    } );
    const dampingControl = new WOASNumberControl( WaveOnAStringFluent.dampingStringProperty, dampingProperty, {
      delta: 1,
      numberDisplayOptions: getNumberDisplayOptions(
        WaveOnAStringFluent.patternValueUnitPercentageStringProperty,
        WaveOnAStringFluent.a11y.valuePatterns.percentage,
        0
      ),
      sliderOptions: {
        constrainValue: value => dampingProperty.range.constrainValue( roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'dampingControl' ),
      accessibleHelpText: WaveOnAStringFluent.a11y.dampingControl.accessibleHelpTextStringProperty
    } );
    const frequencyControl = new WOASNumberControl( WaveOnAStringFluent.frequencyStringProperty, model.frequencyProperty, {
      delta: 0.01,
      numberDisplayOptions: getNumberDisplayOptions(
        WaveOnAStringFluent.patternValueUnitHzStringProperty,
        WaveOnAStringFluent.a11y.valuePatterns.hertz,
        2
      ),
      sliderOptions: {
        constrainValue: value => model.frequencyProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'frequencyControl' ),
      phetioDocumentation: 'Frequency control is only available in the Oscillate mode',
      accessibleHelpText: WaveOnAStringFluent.a11y.frequencyControl.accessibleHelpTextStringProperty
    } );
    const pulseWidthControl = new WOASNumberControl( WaveOnAStringFluent.pulseWidthStringProperty, model.pulseWidthProperty, {
      delta: 0.01,
      numberDisplayOptions: getNumberDisplayOptions(
        WaveOnAStringFluent.patternValueUnitSStringProperty,
        WaveOnAStringFluent.a11y.valuePatterns.seconds,
        2
      ),
      sliderOptions: {
        constrainValue: value => model.pulseWidthProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'pulseWidthControl' ),
      phetioDocumentation: 'Pulse width control is only available in the Pulse mode',
      accessibleHelpText: WaveOnAStringFluent.a11y.pulseWidthControl.accessibleHelpTextStringProperty
    } );
    const amplitudeControl = new WOASNumberControl( WaveOnAStringFluent.amplitudeStringProperty, model.amplitudeProperty, {
      delta: 0.01,
      numberDisplayOptions: getNumberDisplayOptions(
        WaveOnAStringFluent.patternValueUnitCmStringProperty,
        WaveOnAStringFluent.a11y.valuePatterns.centimeters,
        2
      ),
      sliderOptions: {
        constrainValue: value => model.amplitudeProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'amplitudeControl' ),
      phetioDocumentation: 'Amplitude control is only available in the Oscillate/Pulse modes',
      accessibleHelpText: WaveOnAStringFluent.a11y.amplitudeControl.accessibleHelpTextStringProperty
    } );

    // We want the pulse-width and frequency controls to have the same bounds (they replace each other in the UI)
    const frequencyPulseWidthAlignGroup = new AlignGroup();
    const frequencyAlignBox = frequencyPulseWidthAlignGroup.createBox( frequencyControl, {
      visibleProperty: frequencyControl.visibleProperty
    } );
    const pulseWidthAlignBox = frequencyPulseWidthAlignGroup.createBox( pulseWidthControl, {
      visibleProperty: pulseWidthControl.visibleProperty
    } );

    // Contains the NumberControls, which are shown/hidden based on the mode
    const controlBox = new HBox( {
      spacing: 35
    } );
    model.waveModeProperty.link( mode => {
      if ( mode === WOASMode.OSCILLATE ) {
        controlBox.children = [ amplitudeControl, frequencyAlignBox, dampingControl, tensionControl ];
      }
      else if ( mode === WOASMode.MANUAL ) {
        controlBox.children = [ dampingControl, tensionControl ];
      }
      else if ( mode === WOASMode.PULSE ) {
        controlBox.children = [ amplitudeControl, pulseWidthAlignBox, dampingControl, tensionControl ];
      }
      else {
        throw new Error( `Unknown mode: ${mode}` );
      }
    } );

    const contentBox = new HBox( {
      spacing: 20,
      children: [
        controlBox,
        separator,
        checkboxGroup
      ]
    } );

    super( contentBox, {
      tandem: tandem,
      fill: WOASColors.panelBackgroundColorProperty,
      cornerRadius: 5,
      xMargin: 15,
      yMargin: 5,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );

    this.tensionControl = tensionControl;
    this.dampingControl = dampingControl;
    this.frequencyControl = frequencyControl;
    this.pulseWidthControl = pulseWidthControl;
    this.amplitudeControl = amplitudeControl;
    this.checkboxGroup = checkboxGroup;
  }
}

waveOnAString.register( 'BottomControlPanel', BottomControlPanel );