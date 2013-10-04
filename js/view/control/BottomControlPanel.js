/**
 * Copyright 2002-2013, University of Colorado
 * buttons and model control elements view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var rulersString = require( 'string!WOAS/rulers' );
  var timerString = require( 'string!WOAS/timer' );
  var referenceLineString = require( 'string!WOAS/referenceLine' );
  var tensionString = require( 'string!WOAS/tension' );
  var dampingString = require( 'string!WOAS/damping' );
  var lowString = require( 'string!WOAS/low' );
  var highString = require( 'string!WOAS/high' );
  var noneString = require( 'string!WOAS/none' );
  var lotsString = require( 'string!WOAS/lots' );
  var frequencyString = require( 'string!WOAS/frequency' );
  var patternValueUnitHzString = require( 'string!WOAS/patternValueUnitHz' );
  var pulseWidthString = require( 'string!WOAS/pulseWidth' );
  var patternValueUnitSString = require( 'string!WOAS/patternValueUnitS' );
  var amplitudeString = require( 'string!WOAS/amplitude' );
  var patternValueUnitCmString = require( 'string!WOAS/patternValueUnitCm' );
  var Panel = require( 'SUN/Panel' );
  var CheckBoxGroup = require( 'view/control/CheckBoxGroup' );
  var Slider = require( 'view/control/slider/Slider' );

  var tension = {min: 0, max: 2};
  var damping = {min: 0, max: 100};
  var frequency = {min: 0.00, max: 3.00};
  var pulseWidth = {min: 0.0, max: 4.0};
  var amplitude = {min: 0.0, max: 3.0};

  function BottomControlPanel( model ) {

    Node.call( this, { x: 5, y: model.height - 90, scale: 0.7 } );

    var elements1 = new Node(),
      elements2 = new Node(),
      elements3 = new Node(),
      panel1, panel2, panel3;
    var checkBox = new CheckBoxGroup( {check: [
      {text: rulersString, property: model.rulersProperty},
      {text: timerString, property: model.timerProperty},
      {text: referenceLineString, property: model.referenceLineProperty}
    ], x: 0, y: 0} );

    var slider = new Slider( -210, 0, {title: tensionString, property: model.tensionProperty, rounding: 0, scope: tension, tick: {step: 1, minText: lowString, maxText: highString} } );
    var slider2 = new Slider( -420, 0, {title: dampingString, property: model.dampingProperty, rounding: -1, scope: damping, tick: {step: 10, minText: noneString, maxText: lotsString} } );
    var slider3 = new Slider( -630, 0, {type: 'button', buttonStep: 0.01, title: frequencyString, property: model.frequencyProperty, patternValueUnit: patternValueUnitHzString, rounding: 2, scope: frequency } );
    var slider5 = new Slider( -630, 0, {type: 'button', buttonStep: 0.1, title: pulseWidthString, property: model.pulseWidthProperty, patternValueUnit: patternValueUnitSString, rounding: 1, scope: pulseWidth } );
    var slider4 = new Slider( -840, 0, {type: 'button', buttonStep: 0.1, title: amplitudeString, property: model.amplitudeProperty, patternValueUnit: patternValueUnitCmString, rounding: 1, scope: amplitude } );

    elements1.addChild( checkBox );
    elements1.addChild( slider );
    elements1.addChild( slider2 );
    elements1.addChild( slider3 );
    elements1.addChild( slider4 );

    elements2.addChild( checkBox );
    elements2.addChild( slider );
    elements2.addChild( slider2 );

    elements3.addChild( checkBox );
    elements3.addChild( slider );
    elements3.addChild( slider2 );
    elements3.addChild( slider5 );
    elements3.addChild( slider4 );

    this.addChild( panel1 = new Panel( elements1, {fill: '#D9FCC5', xMargin: 10, yMargin: 5} ) );
    this.addChild( panel2 = new Panel( elements2, {fill: '#D9FCC5', xMargin: 10, yMargin: 5} ) );
    this.addChild( panel3 = new Panel( elements3, {fill: '#D9FCC5', xMargin: 10, yMargin: 5} ) );

    if ( panel3.width > 1000 ) {
      panel3.scale( 1000 / panel3.width );
    }
    if ( panel2.width > 1000 ) {
      panel2.scale( 1000 / panel2.width );
    }
    if ( panel1.width > 1000 ) {
      panel1.scale( 1000 / panel1.width );
    }
    panel3.right = panel2.right = panel1.right = 1000;

    model.modeProperty.link( function updateBottomControlPanel( value ) {
      panel1.setVisible( value === 'oscillate' );
      panel2.setVisible( value === 'manual' );
      panel3.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, BottomControlPanel );

  return BottomControlPanel;
} );