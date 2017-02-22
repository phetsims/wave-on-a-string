// Copyright 2013-2015, University of Colorado Boulder

/**
 * buttons and model control elements view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var Slider = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/slider/Slider' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var Util = require( 'DOT/Util' );

  // strings
  var rulersString = require( 'string!WAVE_ON_A_STRING/rulers' );
  var timerString = require( 'string!WAVE_ON_A_STRING/timer' );
  var referenceLineString = require( 'string!WAVE_ON_A_STRING/referenceLine' );
  var tensionString = require( 'string!WAVE_ON_A_STRING/tension' );
  var dampingString = require( 'string!WAVE_ON_A_STRING/damping' );
  var lowString = require( 'string!WAVE_ON_A_STRING/low' );
  var highString = require( 'string!WAVE_ON_A_STRING/high' );
  var frequencyString = require( 'string!WAVE_ON_A_STRING/frequency' );
  var patternValueUnitHzString = require( 'string!WAVE_ON_A_STRING/patternValueUnitHz' );
  var pulseWidthString = require( 'string!WAVE_ON_A_STRING/pulseWidth' );
  var patternValueUnitSString = require( 'string!WAVE_ON_A_STRING/patternValueUnitS' );
  var amplitudeString = require( 'string!WAVE_ON_A_STRING/amplitude' );
  var patternValueUnitCmString = require( 'string!WAVE_ON_A_STRING/patternValueUnitCm' );
  var patternValueUnitPercentageString = require( 'string!WAVE_ON_A_STRING/patternValueUnitPercentage' );

  var OFFSET = 35;

  function BottomControlPanel( model ) {

    Node.call( this, { scale: 0.7 } );

    var checkBoxTextOptions = {
      font: new PhetFont( 15 ),
      maxWidth: 130
    };
    var checkBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new Text( rulersString, checkBoxTextOptions ),
        property: model.rulersProperty,
        indent: 0
      }, {
        content: new Text( timerString, checkBoxTextOptions ),
        property: model.timerProperty,
        indent: 0
      }, {
        content: new Text( referenceLineString, checkBoxTextOptions ),
        property: model.referenceLineProperty,
        indent: 0
      }
    ] );

    var separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    separator.right = checkBoxGroup.left - 20;
    checkBoxGroup.centerY = separator.centerY;

    var tensionSlider = new Slider( {
      title: tensionString,
      property: model.tensionProperty,
      round: false,
      range: Constants.tensionRange,
      titleVerticalOffset: 15,
      tick: { step: 0.25, minText: lowString, maxText: highString },
      constrainValue: function( value ){
        // logic to round the value to nearest .25 to have snap behaviour
        value = Util.toFixedNumber( value, 2 );
        value = value * 100;
        value = Util.roundSymmetric( value / 25 ) * 25 ;
        value = value / 100;
        return value;
      }
    } );

    tensionSlider.right = separator.left - 20;

    var dampingSlider = new Slider( {
      title: dampingString,
      type: 'button',
      buttonStep: 1,
      property: model.dampingProperty,
      patternValueUnit: patternValueUnitPercentageString,
      roundingDigits: 0,
      range: Constants.dampingRange
    } );

    dampingSlider.right = tensionSlider.left - OFFSET;

    var frequencySlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: frequencyString,
      property: model.frequencyProperty,
      patternValueUnit: patternValueUnitHzString,
      roundingDigits: 2,
      range: Constants.frequencyRange
    } );

    frequencySlider.right = dampingSlider.left - OFFSET;

    var pulseWidthSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: pulseWidthString,
      property: model.pulseWidthProperty,
      patternValueUnit: patternValueUnitSString,
      roundingDigits: 2,
      range: Constants.pulseWidthRange
    } );

    pulseWidthSlider.right = dampingSlider.left - OFFSET;

    var amplitudeSlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: amplitudeString,
      property: model.amplitudeProperty,
      patternValueUnit: patternValueUnitCmString,
      roundingDigits: 2,
      range: Constants.amplitudeRange
    } );

    amplitudeSlider.right = frequencySlider.left - OFFSET;


    var oscillatePanel = new Panel( new Node( {
      children: [ amplitudeSlider, frequencySlider, dampingSlider, tensionSlider, separator, checkBoxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( oscillatePanel );

    var manualPanel = new Panel( new Node( {
      children: [ dampingSlider, tensionSlider, separator, checkBoxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 15, yMargin: 5
    } );
    this.addChild( manualPanel );

    var pulsePanel = new Panel( new Node( {
      children: [ amplitudeSlider, pulseWidthSlider, dampingSlider, tensionSlider, separator, checkBoxGroup ]
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
