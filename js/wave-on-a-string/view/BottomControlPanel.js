// Copyright 2013-2021, University of Colorado Boulder

/**
 * Control panel on the bottom of the screen, with many controls in it
 *
 * @author Anton Ulyanov (Mlearner)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignGroup, HBox, Line, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import waveOnAString from '../../waveOnAString.js';
import waveOnAStringStrings from '../../waveOnAStringStrings.js';
import WOASModel from '../model/WOASModel.js';
import WOASNumberControl from './WOASNumberControl.js';

const amplitudeString = waveOnAStringStrings.amplitude;
const dampingString = waveOnAStringStrings.damping;
const frequencyString = waveOnAStringStrings.frequency;
const patternValueUnitCmString = waveOnAStringStrings.patternValueUnitCm;
const patternValueUnitHzString = waveOnAStringStrings.patternValueUnitHz;
const patternValueUnitPercentageString = waveOnAStringStrings.patternValueUnitPercentage;
const patternValueUnitSString = waveOnAStringStrings.patternValueUnitS;
const pulseWidthString = waveOnAStringStrings.pulseWidth;
const referenceLineString = waveOnAStringStrings.referenceLine;
const rulersString = waveOnAStringStrings.rulers;
const tensionString = waveOnAStringStrings.tension;
const timerString = waveOnAStringStrings.timer;

class BottomControlPanel extends Panel {
  /**
   * @param {WOASModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    const checkboxTextOptions = {
      font: new PhetFont( 15 ),
      maxWidth: 130
    };
    const checkboxTandem = tandem.createTandem( 'checkboxGroup' );
    const checkboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( rulersString, checkboxTextOptions ),
      property: model.rulersVisibleProperty,
      tandem: checkboxTandem.createTandem( 'rulersCheckbox' )
    }, {
      node: new Text( timerString, checkboxTextOptions ),
      property: model.stopwatch.isVisibleProperty,
      tandem: checkboxTandem.createTandem( 'stopwatchCheckbox' )
    }, {
      node: new Text( referenceLineString, checkboxTextOptions ),
      property: model.referenceLineVisibleProperty,
      tandem: checkboxTandem.createTandem( 'referenceLineCheckbox' )
    } ], {
      tandem: checkboxTandem
    } );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    const tensionProperty = new DynamicProperty( new Property( model.tensionProperty ), {
      bidirectional: true,
      map: value => value * 100,
      inverseMap: value => value / 100
    } );
    // TODO: how to support range on dynamic properties?
    tensionProperty.range = new Range( model.tensionProperty.range.min * 100, model.tensionProperty.range.max * 100 );

    const tensionControl = new WOASNumberControl( tensionString, tensionProperty, {
      delta: 1,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: patternValueUnitPercentageString
      },
      sliderOptions: {
        constrainValue: value => tensionProperty.range.constrainValue( Utils.roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'tensionControl' )
    } );
    const dampingControl = new WOASNumberControl( dampingString, model.dampingProperty, {
      delta: 1,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: patternValueUnitPercentageString
      },
      sliderOptions: {
        constrainValue: value => model.dampingProperty.range.constrainValue( Utils.roundToInterval( value, 5 ) )
      },
      tandem: tandem.createTandem( 'dampingControl' )
    } );
    const frequencyControl = new WOASNumberControl( frequencyString, model.frequencyProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitHzString
      },
      sliderOptions: {
        constrainValue: value => model.frequencyProperty.range.constrainValue( Utils.roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'frequencyControl' )
    } );
    const pulseWidthControl = new WOASNumberControl( pulseWidthString, model.pulseWidthProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitSString
      },
      sliderOptions: {
        constrainValue: value => model.pulseWidthProperty.range.constrainValue( Utils.roundToInterval( value, 0.1 ) )
      },
      tandem: tandem.createTandem( 'pulseWidthControl' )
    } );
    const amplitudeControl = new WOASNumberControl( amplitudeString, model.amplitudeProperty, {
      delta: 0.01,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitCmString
      },
      sliderOptions: {
        constrainValue: value => model.amplitudeProperty.range.constrainValue( Utils.roundToInterval( value, 0.1 ) )
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
      if ( mode === WOASModel.Mode.OSCILLATE ) {
        controlBox.children = [ amplitudeControl, frequencyAlignBox, dampingControl, tensionControl ];
      }
      else if ( mode === WOASModel.Mode.MANUAL ) {
        controlBox.children = [ dampingControl, tensionControl ];
      }
      else if ( mode === WOASModel.Mode.PULSE ) {
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
      scale: 0.7,
      tandem: tandem,
      fill: '#D9FCC5',
      xMargin: 15,
      yMargin: 5
    } );
  }
}

waveOnAString.register( 'BottomControlPanel', BottomControlPanel );
export default BottomControlPanel;