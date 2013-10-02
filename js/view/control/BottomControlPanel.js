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
  var Strings = require( 'Strings' );
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
      {text: Strings.rulers, property: model.rulersProperty},
      {text: Strings.timer, property: model.timerProperty},
      {text: Strings.referenceLine, property: model.referenceLineProperty}
    ], x: 0, y: 0} );

    var slider = new Slider( -210, 0, {title: Strings.tension, property: model.tensionProperty, rounding: 0, scope: tension, tick: {step: 1, minText: Strings.low, maxText: Strings.high} } );
    var slider2 = new Slider( -420, 0, {title: Strings.damping, property: model.dampingProperty, rounding: -1, scope: damping, tick: {step: 10, minText: Strings.none, maxText: Strings.lots} } );
    var slider3 = new Slider( -630, 0, {type: 'button', buttonStep: 0.01, title: Strings.frequency, property: model.frequencyProperty, patternValueUnit: Strings.patternValueUnitHz, rounding: 2, scope: frequency } );
    var slider5 = new Slider( -630, 0, {type: 'button', buttonStep: 0.1, title: Strings.pulseWidth, property: model.pulseWidthProperty, patternValueUnit: Strings.patternValueUnitS, rounding: 1, scope: pulseWidth } );
    var slider4 = new Slider( -840, 0, {type: 'button', buttonStep: 0.1, title: Strings.amplitude, property: model.amplitudeProperty, patternValueUnit: Strings.patternValueUnitCm, rounding: 1, scope: amplitude } );

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