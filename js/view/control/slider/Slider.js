/**
 * Copyright 2002-2013, University of Colorado
 * view for slider control
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HorizontalSlider = require( 'view/control/slider/HorizontalSlider' );
  var ArrowButton = require( 'view/control/slider/ArrowButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  function Slider( x, y, options ) {
    options = _.extend(
      {
        type: 'simple',
        tick: {step: 0, minText: '', maxText: ''},
        unit: '',
        patternValueUnit: '',
        title: '',
        property: null,
        scope: {min: 0, max: 100},
        rounding: false,
        width: 200,
        height: 100,
        buttonStep: 1
      }, options );

    Node.call( this, {x: x, y: y} );

    var tick = false;
    if ( options.type === 'simple' ) {
      tick = options.tick;
    }
    var buttonNode = new Node( {y: 25} ),
      plusButton, minusButton, valueLabel
      ;
    var buttonPropertyUpdate = function( value ) {
      return function() {
        options.property.set( Math.max( Math.min( options.property.get() + value, options.scope.max ), options.scope.min ) );
      };
    };

    buttonNode.addChild( plusButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), {right: options.width - 15, centerY: 15} ) );
    buttonNode.addChild( minusButton = new ArrowButton( 'left', buttonPropertyUpdate( -options.buttonStep ), {left: 15, centerY: 15} ) );
    buttonNode.addChild( new Rectangle( 0, 0, 90, 30, 5, 5, {fill: "#FFF", stroke: "#000", lineWidth: 1, centerX: options.width / 2, top: 0} ) );
    buttonNode.addChild( valueLabel = new Text( "0", {font: new PhetFont( 18 ), centerX: options.width / 2, top: 5} ) );

    this.addChild( new Rectangle( 0, 0, options.width, options.height, {} ) );
    if ( options.type === 'button' ) {
      this.addChild( buttonNode );
    }
    this.addChild( new HorizontalSlider( 5, options.height - 20, options.width - 10, options.property, require( 'image!WOAS/../images/slider.png' ), options.scope, options.rounding, tick ) );
    this.addChild( new Text( options.title, {centerX: options.width / 2, top: 3, font: new PhetFont( 18 )} ) );

    options.property.link( function updateMass( value ) {
      var text = options.property.get();
      if ( options.rounding !== false && options.rounding >= 0 ) {
        text = options.property.get().toFixed( options.rounding );
      }
      //valueLabel.text = text + " " + options.unit;
      //patternValueUnitHz
      valueLabel.text = StringUtils.format( options.patternValueUnit, text );
      valueLabel.centerX = options.width / 2;
      plusButton.setEnabled( options.property.get() < options.scope.max );
      minusButton.setEnabled( options.property.get() > options.scope.min );
    } );
  }

  inherit( Node, Slider );

  return Slider;
} );