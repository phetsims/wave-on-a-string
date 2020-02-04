// Copyright 2013-2020, University of Colorado Boulder

/**
 * Control panel on the bottom of the screen, with many controls in it
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  const WOASNumberControl = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASNumberControl' );
  const WOASSlider = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASSlider' );

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

      const tensionSlider = new WOASSlider( {
        title: tensionString,
        property: model.tensionProperty,
        round: false,
        range: model.tensionProperty.range,
        titleVerticalOffset: 15,
        tick: { step: 0.25, minText: lowString, maxText: highString },
        constrainValue: value => {
          // logic to round the value to nearest .25 to have snap behaviour
          value = Utils.toFixedNumber( value, 2 );
          value = value * 100;
          value = Utils.roundSymmetric( value / 25 ) * 25;
          value = value / 100;
          return value;
        }
      } );

      tensionSlider.right = separator.left - 20;

      const dampingSlider = new WOASNumberControl( dampingString, model.dampingProperty, {
        delta: 1,
        numberDisplayOptions: {
          decimalPlaces: 0,
          valuePattern: patternValueUnitPercentageString
        },
        tandem: tandem.createTandem( 'dampingSlider' )
      } );

      dampingSlider.right = tensionSlider.left - OFFSET;

      const frequencySlider = new WOASNumberControl( frequencyString, model.frequencyProperty, {
        delta: 0.01,
        numberDisplayOptions: {
          decimalPlaces: 2,
          valuePattern: patternValueUnitHzString
        },
        tandem: tandem.createTandem( 'frequencySlider' )
      } );

      frequencySlider.right = dampingSlider.left - OFFSET;

      const pulseWidthSlider = new WOASNumberControl( pulseWidthString, model.pulseWidthProperty, {
        delta: 0.01,
        numberDisplayOptions: {
          decimalPlaces: 2,
          valuePattern: patternValueUnitSString
        },
        tandem: tandem.createTandem( 'pulseWidthSlider' )
      } );

      pulseWidthSlider.right = dampingSlider.left - OFFSET;

      const amplitudeSlider = new WOASNumberControl( amplitudeString, model.amplitudeProperty, {
        delta: 0.01,
        numberDisplayOptions: {
          decimalPlaces: 2,
          valuePattern: patternValueUnitCmString
        },
        tandem: tandem.createTandem( 'amplitudeSlider' )
      } );

      amplitudeSlider.right = frequencySlider.left - OFFSET;

      const oscillatePanel = new Panel( new Node( {
        children: [ amplitudeSlider, frequencySlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
      } ), {
        fill: '#D9FCC5', xMargin: 15, yMargin: 5,
        tandem: tandem.createTandem( 'oscillatePanel' )
      } );
      this.addChild( oscillatePanel );

      const manualPanel = new Panel( new Node( {
        children: [ dampingSlider, tensionSlider, separator, checkboxGroup ]
      } ), {
        fill: '#D9FCC5', xMargin: 15, yMargin: 5,
        tandem: tandem.createTandem( 'manualPanel' )
      } );
      this.addChild( manualPanel );

      const pulsePanel = new Panel( new Node( {
        children: [ amplitudeSlider, pulseWidthSlider, dampingSlider, tensionSlider, separator, checkboxGroup ]
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

  return waveOnAString.register( 'BottomControlPanel', BottomControlPanel );
} );
