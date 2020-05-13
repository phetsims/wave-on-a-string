// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel on the bottom of the screen, with many controls in it
 *
 * @author Anton Ulyanov (Mlearner)
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
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

// constants
const OFFSET = 35;

class BottomControlPanel extends Node {
  /**
   * @param {WOASModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( { scale: 0.7 } );

    const checkboxTextOptions = {
      font: new PhetFont( 15 ),
      maxWidth: 130
    };
    const checkboxTandem = tandem.createTandem( 'visibilityCheckboxGroup' );
    const checkboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( rulersString, checkboxTextOptions ),
      property: model.rulersVisibleProperty,
      tandem: checkboxTandem.createTandem( 'rulersVisibleCheckbox' )
    }, {
      node: new Text( timerString, checkboxTextOptions ),
      property: model.stopwatchVisibleProperty,
      tandem: checkboxTandem.createTandem( 'stopwatchVisibleCheckbox' )
    }, {
      node: new Text( referenceLineString, checkboxTextOptions ),
      property: model.referenceLineVisibleProperty,
      tandem: checkboxTandem.createTandem( 'referenceLineVisibleCheckbox' )
    } ], {
      tandem: checkboxTandem
    } );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    separator.right = checkboxGroup.left - 20;
    checkboxGroup.centerY = separator.centerY;

    const tensionProperty = new DynamicProperty( new Property( model.tensionProperty ), {
      bidirectional: true,
      map: value => value * 100,
      inverseMap: value => value / 100
    } );

    // TODO: how to support range on dynamic properties?
    tensionProperty.range = new Range( model.tensionProperty.range.min * 100, model.tensionProperty.range.max * 100 );

    const tensionControl = new WOASNumberControl( tensionString, tensionProperty, {
      delta: 5,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: patternValueUnitPercentageString
      },
      tandem: tandem.createTandem( 'tensionControl' )
    } );

    tensionControl.right = separator.left - 20;

    const dampingControl = new WOASNumberControl( dampingString, model.dampingProperty, {
      delta: 5,
      numberDisplayOptions: {
        decimalPlaces: 0,
        valuePattern: patternValueUnitPercentageString
      },
      tandem: tandem.createTandem( 'dampingControl' )
    } );

    dampingControl.right = tensionControl.left - OFFSET;
    tensionControl.bottom = dampingControl.bottom;

    const frequencyControl = new WOASNumberControl( frequencyString, model.frequencyProperty, {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitHzString
      },
      tandem: tandem.createTandem( 'frequencyControl' )
    } );

    frequencyControl.right = dampingControl.left - OFFSET;

    const pulseWidthControl = new WOASNumberControl( pulseWidthString, model.pulseWidthProperty, {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitSString
      },
      tandem: tandem.createTandem( 'pulseWidthControl' )
    } );

    pulseWidthControl.right = dampingControl.left - OFFSET;

    const amplitudeControl = new WOASNumberControl( amplitudeString, model.amplitudeProperty, {
      delta: 0.1,
      numberDisplayOptions: {
        decimalPlaces: 2,
        valuePattern: patternValueUnitCmString
      },
      tandem: tandem.createTandem( 'amplitudeControl' )
    } );

    amplitudeControl.right = frequencyControl.left - OFFSET;

    // 20 between separator and tensionControl
    // 20 between checkboxGroup and separator

    const oscillatePanel = new Panel( new Node( {
      children: [ amplitudeControl, frequencyControl, dampingControl, tensionControl, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5,
      tandem: tandem.createTandem( 'oscillatePanel' )
    } );
    this.addChild( oscillatePanel );

    const manualPanel = new Panel( new Node( {
      children: [ dampingControl, tensionControl, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5,
      tandem: tandem.createTandem( 'manualPanel' )
    } );
    this.addChild( manualPanel );

    const pulsePanel = new Panel( new Node( {
      children: [ amplitudeControl, pulseWidthControl, dampingControl, tensionControl, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5,
      tandem: tandem.createTandem( 'pulsePanel' )
    } );
    this.addChild( pulsePanel );

    oscillatePanel.right = manualPanel.right;
    pulsePanel.right = manualPanel.right;
    model.modeProperty.link( function updateBottomControlPanel( value ) {
      oscillatePanel.visible = value === WOASModel.Mode.OSCILLATE;
      manualPanel.visible = value === WOASModel.Mode.MANUAL;
      pulsePanel.visible = value === WOASModel.Mode.PULSE;
    } );
  }
}

waveOnAString.register( 'BottomControlPanel', BottomControlPanel );
export default BottomControlPanel;