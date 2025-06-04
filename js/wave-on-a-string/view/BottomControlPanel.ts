// Copyright 2013-2025, University of Colorado Boulder

/**
 * Control panel on the bottom of the screen, with many controls in it
 *
 * @author Anton Ulyanov (Mlearner)
 */

import RangedDynamicProperty from '../../../../axon/js/RangedDynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringStrings from '../../WaveOnAStringStrings.js';
import type WOASModel from '../model/WOASModel.js';
import WOASNumberControl from './WOASNumberControl.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import { WOASMode } from '../model/WOASMode.js';
import { NORMAL_FONT } from '../WOASConstants.js';

export default class BottomControlPanel extends Panel {
  public constructor( model: WOASModel, tandem: Tandem ) {
    const checkboxTextOptions = {
      font: NORMAL_FONT,
      maxWidth: 130
    };
    const checkboxTandem = tandem.createTandem( 'checkboxGroup' );
    const checkboxGroup = new VerticalCheckboxGroup( [ {
      createNode: () => new Text( WaveOnAStringStrings.rulersStringProperty, checkboxTextOptions ),
      property: model.rulersVisibleProperty,
      tandemName: 'rulersCheckbox'
    }, {
      createNode: () => new Text( WaveOnAStringStrings.timerStringProperty, checkboxTextOptions ),
      property: model.stopwatch.isVisibleProperty,
      tandemName: 'stopwatchCheckbox'
    }, {
      createNode: () => new Text( WaveOnAStringStrings.referenceLineStringProperty, checkboxTextOptions ),
      property: model.referenceLineVisibleProperty,
      tandemName: 'referenceLineCheckbox'
    } ], {
      tandem: checkboxTandem
    } );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    const tensionProperty = new RangedDynamicProperty( new Property( model.tensionProperty ), {
      bidirectional: true,
      map: ( value: number ) => value * 100,
      inverseMap: ( value: number ) => value / 100,
      range: new Range( model.tensionProperty.range.min * 100, model.tensionProperty.range.max * 100 )
    } );

    const tensionControl = new WOASNumberControl( WaveOnAStringStrings.tensionStringProperty, tensionProperty, {
      delta: 1,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: WaveOnAStringStrings.patternValueUnitPercentageStringProperty
      },
      sliderOptions: {
        constrainValue: value => tensionProperty.range.constrainValue( roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'tensionControl' )
    } );
    const dampingControl = new WOASNumberControl( WaveOnAStringStrings.dampingStringProperty, model.dampingProperty, {
      delta: 1,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: WaveOnAStringStrings.patternValueUnitPercentageStringProperty
      },
      sliderOptions: {
        constrainValue: value => model.dampingProperty.range.constrainValue( roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'dampingControl' )
    } );
    const frequencyControl = new WOASNumberControl( WaveOnAStringStrings.frequencyStringProperty, model.frequencyProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: WaveOnAStringStrings.patternValueUnitHzStringProperty
      },
      sliderOptions: {
        constrainValue: value => model.frequencyProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'frequencyControl' )
    } );
    const pulseWidthControl = new WOASNumberControl( WaveOnAStringStrings.pulseWidthStringProperty, model.pulseWidthProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: WaveOnAStringStrings.patternValueUnitSStringProperty
      },
      sliderOptions: {
        constrainValue: value => model.pulseWidthProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'pulseWidthControl' )
    } );
    const amplitudeControl = new WOASNumberControl( WaveOnAStringStrings.amplitudeStringProperty, model.amplitudeProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: WaveOnAStringStrings.patternValueUnitCmStringProperty
      },
      sliderOptions: {
        constrainValue: value => model.amplitudeProperty.range.constrainValue( roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'amplitudeControl' )
    } );

    // We want the pulse-width and frequency controls to have the same bounds
    const frequencyPulseWidthAlignGroup = new AlignGroup();
    const frequencyAlignBox = frequencyPulseWidthAlignGroup.createBox( frequencyControl, {
      visibleProperty: frequencyControl.visibleProperty
    } );
    const pulseWidthAlignBox = frequencyPulseWidthAlignGroup.createBox( pulseWidthControl, {
      visibleProperty: pulseWidthControl.visibleProperty
    } );

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
      fill: '#D9FCC5',
      cornerRadius: 5,
      xMargin: 15,
      yMargin: 5
    } );
  }
}

waveOnAString.register( 'BottomControlPanel', BottomControlPanel );