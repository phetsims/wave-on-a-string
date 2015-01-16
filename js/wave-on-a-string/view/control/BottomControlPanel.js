// Copyright 2002-2014, University of Colorado Boulder

/**
 * buttons and model control elements view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Panel = require( 'SUN/Panel' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var Slider = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/slider/Slider' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );

  // strings
  var rulersString = require( 'string!WAVE_ON_A_STRING/rulers' );
  var timerString = require( 'string!WAVE_ON_A_STRING/timer' );
  var referenceLineString = require( 'string!WAVE_ON_A_STRING/referenceLine' );
  var tensionString = require( 'string!WAVE_ON_A_STRING/tension' );
  var dampingString = require( 'string!WAVE_ON_A_STRING/damping' );
  var lowString = require( 'string!WAVE_ON_A_STRING/low' );
  var highString = require( 'string!WAVE_ON_A_STRING/high' );
  var noneString = require( 'string!WAVE_ON_A_STRING/none' );
  var lotsString = require( 'string!WAVE_ON_A_STRING/lots' );
  var frequencyString = require( 'string!WAVE_ON_A_STRING/frequency' );
  var patternValueUnitHzString = require( 'string!WAVE_ON_A_STRING/patternValueUnitHz' );
  var pulseWidthString = require( 'string!WAVE_ON_A_STRING/pulseWidth' );
  var patternValueUnitSString = require( 'string!WAVE_ON_A_STRING/patternValueUnitS' );
  var amplitudeString = require( 'string!WAVE_ON_A_STRING/amplitude' );
  var patternValueUnitCmString = require( 'string!WAVE_ON_A_STRING/patternValueUnitCm' );

  function BottomControlPanel( model ) {

    Node.call( this, { x: 5, scale: 0.7 } );

    var checkBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new Text( rulersString, { font: new PhetFont( 15 ) } ),
        property: model.rulersProperty,
        indent: 0
      }, {
        content: new Text( timerString, { font: new PhetFont( 15 ) } ),
        property: model.timerProperty,
        indent: 0
      }, {
        content: new Text( referenceLineString, { font: new PhetFont( 15 ) } ),
        property: model.referenceLineProperty,
        indent: 0
      },
    ], {
      centerY: 55
    } );

    var checkBoxGroupOffset = 20;
    checkBoxGroup.x = checkBoxGroupOffset;

    var tensionSlider = new Slider( {
      sliderX: 60 - 240,
      title: tensionString,
      property: model.tensionProperty,
      trackSize: new Dimension2( 80, 2 ),
      rounding: 0,
      range: Constants.tensionRange,
      titleVerticalOffset: 15,
      tick: { step: 1, minText: lowString, maxText: highString }
    } );
    var dampingSlider = new Slider( {
      sliderX: 60 - 420,
      title: dampingString,
      property: model.dampingProperty,
      rounding: -1,
      range: Constants.dampingRange,
      titleVerticalOffset: 15,
      tick: { step: 10, minText: noneString, maxText: lotsString }
    } );
    var frequencySlider = new Slider( {
      sliderX: 60 - 630,
      type: 'button',
      buttonStep: 0.01,
      title: frequencyString,
      property: model.frequencyProperty,
      patternValueUnit: patternValueUnitHzString,
      rounding: 2,
      range: Constants.frequencyRange
    } );
    var pulseWidthSlider = new Slider( {
      sliderX: 60 - 630,
      type: 'button',
      buttonStep: 0.01,
      title: pulseWidthString,
      property: model.pulseWidthProperty,
      patternValueUnit: patternValueUnitSString,
      rounding: 2,
      range: Constants.pulseWidthRange
    } );
    var amplitudeSlider = new Slider( {
      sliderX: 60 - 840,
      type: 'button',
      buttonStep: 0.01,
      title: amplitudeString,
      property: model.amplitudeProperty,
      patternValueUnit: patternValueUnitCmString,
      rounding: 2,
      range: Constants.amplitudeRange
    } );

    var separator = new Line( 0, 10, 0, 100, { stroke: 'gray', lineWidth: 1 } );

    var oscillatePanel = new Panel( new Node( {
      children: [ amplitudeSlider, frequencySlider, dampingSlider, tensionSlider, separator, checkBoxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 10, yMargin: 5
    } );
    this.addChild( oscillatePanel );

    var manualPanel = new Panel( new Node( {
      children: [ dampingSlider, tensionSlider, separator, checkBoxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 10, yMargin: 5
    } );
    this.addChild( manualPanel );

    var pulsePanel = new Panel( new Node( {
      children: [ amplitudeSlider, pulseWidthSlider, dampingSlider, tensionSlider, separator, checkBoxGroup ]
    } ), {
      fill: '#D9FCC5', xMargin: 10, yMargin: 5
    } );
    this.addChild( pulsePanel );

    pulsePanel.right = manualPanel.right = oscillatePanel.right = Constants.maxWidthBottomControlPanel - 60 + checkBoxGroupOffset;
    this.bottom = Constants.viewSize.height - 10;
    model.modeProperty.link( function updateBottomControlPanel( value ) {
      oscillatePanel.setVisible( value === 'oscillate' );
      manualPanel.setVisible( value === 'manual' );
      pulsePanel.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, BottomControlPanel );

  return BottomControlPanel;
} );
