// Copyright 2013-2018, University of Colorado Boulder

/**
 * buttons and model control elements view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Slider = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/slider/Slider' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // strings
  const amplitudeString = require( 'string!WAVE_ON_A_STRING/amplitude' );
  const dampingString = require( 'string!WAVE_ON_A_STRING/damping' );
  const frequencyString = require( 'string!WAVE_ON_A_STRING/frequency' );
  const highString = require( 'string!WAVE_ON_A_STRING/high' );
  const lowString = require( 'string!WAVE_ON_A_STRING/low' );
  const patternValueUnitCmString = require( 'string!WAVE_ON_A_STRING/patternValueUnitCm' );
  const patternValueUnitHzString = require( 'string!WAVE_ON_A_STRING/patternValueUnitHz' );
  const patternValueUnitPercentageString = require( 'string!WAVE_ON_A_STRING/patternValueUnitPercentage' );
  const patternValueUnitSString = require( 'string!WAVE_ON_A_STRING/patternValueUnitS' );
  const pulseWidthString = require( 'string!WAVE_ON_A_STRING/pulseWidth' );
  const referenceLineString = require( 'string!WAVE_ON_A_STRING/referenceLine' );
  const rulersString = require( 'string!WAVE_ON_A_STRING/rulers' );
  const tensionString = require( 'string!WAVE_ON_A_STRING/tension' );
  const timerString = require( 'string!WAVE_ON_A_STRING/timer' );

  const OFFSET = 35;

  function BottomControlPanel( model ) {

    Node.call( this, { scale: 0.7 } );

    const checkboxTextOptions = {
      font: new PhetFont( 15 ),
      maxWidth: 130
    };
    const checkboxGroup = new VerticalCheckboxGroup( [ {
      node: new Text( rulersString, checkboxTextOptions ),
      property: model.rulersProperty
    }, {
      node: new Text( timerString, checkboxTextOptions ),
      property: model.timerProperty
    }, {
      node: new Text( referenceLineString, checkboxTextOptions ),
      property: model.referenceLineProperty
    } ] );

    const separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    separator.right = checkboxGroup.left - 20;
    checkboxGroup.centerY = separator.centerY;

    const tensionSlider = new Slider( {
      title: tensionString,
      property: model.tensionProperty,
      round: false,
      range: Constants.tensionRange,
      titleVerticalOffset: 15,
      tick: { step: 0.25, minText: lowString, maxText: highString },
      constrainValue: function( value ) {
        // logic to round the value to nearest .25 to have snap behaviour
        value = Util.toFixedNumber( value, 2 );
        value = value * 100;
        value = Util.roundSymmetric( value / 25 ) * 25;
        value = value / 100;
        return value;
      }
    } );

    tensionSlider.right = separator.left - 20;

    const dampingSlider = new Slider( {
      title: dampingString,
      type: 'button',
      buttonStep: 1,
      property: model.dampingProperty,
      patternValueUnit: patternValueUnitPercentageString,
      roundingDigits: 0,
      range: Constants.dampingRange
    } );

    dampingSlider.right = tensionSlider.left - OFFSET;

    const frequencySlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: frequencyString,
      property: model.frequencyProperty,
      patternValueUnit: patternValueUnitHzString,
      roundingDigits: 2,
      range: Constants.frequencyRange
    } );

    frequencySlider.right = dampingSlider.left - OFFSET;

    const pulseWidthSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: pulseWidthString,
      property: model.pulseWidthProperty,
      patternValueUnit: patternValueUnitSString,
      roundingDigits: 2,
      range: Constants.pulseWidthRange
    } );

    pulseWidthSlider.right = dampingSlider.left - OFFSET;

    const amplitudeSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: amplitudeString,
      property: model.amplitudeProperty,
      patternValueUnit: patternValueUnitCmString,
      roundingDigits: 2,
      range: Constants.amplitudeRange
    } );

    amplitudeSlider.right = frequencySlider.left - OFFSET;


    const oscillatePanel = new Panel( new Node( {
      children: [ amplitudeSlider, frequencySlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( oscillatePanel );

    const manualPanel = new Panel( new Node( {
      children: [ dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( manualPanel );

    const pulsePanel = new Panel( new Node( {
      children: [ amplitudeSlider, pulseWidthSlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( pulsePanel );

    oscillatePanel.right = manualPanel.right;
    pulsePanel.right = manualPanel.right;
    model.modeProperty.link( function updateBottomControlPanel( value ) {
      oscillatePanel.setVisible( value === 'oscillate' );
      manualPanel.setVisible( value === 'manual' );
      pulsePanel.setVisible( value === 'pulse' );
    } );
  }

  waveOnAString.register( 'BottomControlPanel', BottomControlPanel );

  inherit( Node, BottomControlPanel );

  return BottomControlPanel;
} );
