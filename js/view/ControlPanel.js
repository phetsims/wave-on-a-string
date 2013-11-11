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
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var speedSlowString = require( 'string!WOAS/speedSlow' );
  var speedNormalString = require( 'string!WOAS/speedNormal' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var BottomControlPanel = require( 'WOAS/view/control/BottomControlPanel' );
  var RadioGroup = require( 'WOAS/view/control/RadioGroup' );
  var PlayPauseButton = require( 'WOAS/view/control/PlayPauseButton' );
  var RestartButton = require( 'WOAS/view/control/RestartButton' );
  var PulseButton = require( 'WOAS/view/control/PulseButton' );
  var WOASTRulers = require( 'WOAS/view/control/WOASTRulers' );
  var WOASTLine = require( 'WOAS/view/control/WOASTLine' );
  var WOASTTimer = require( 'WOAS/view/control/WOASTTimer' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var manualString = require( 'string!WOAS/manual' );
  var oscillateString = require( 'string!WOAS/oscillate' );
  var pulseString = require( 'string!WOAS/pulse' );
  var fixedEndString = require( 'string!WOAS/fixedEnd' );
  var looseEndString = require( 'string!WOAS/looseEnd' );
  var noEndString = require( 'string!WOAS/noEnd' );
  var Constants = require( 'WOAS/Constants' );

  function ControlPanel( model ) {
    Node.call( this );
    var typeRadio, endTypeRadio, speedSlow, speedGroup, pulseButton;
    this.addChild( typeRadio = new RadioGroup( {radio: ['manual', 'oscillate', 'pulse'], text: [manualString, oscillateString, pulseString], property: model.modeProperty, x: 5, y: 5} ) );
    this.addChild( new RestartButton( model, {x: typeRadio.right + 10, y: 25} ) );
    this.addChild( pulseButton = new PulseButton( model, {x: 130, y: Constants.viewSize.height - 135} ) );
    this.addChild( endTypeRadio = new RadioGroup( {radio: ['fixedEnd', 'looseEnd', 'noEnd'], text: [fixedEndString, looseEndString, noEndString], property: model.typeEndProperty, x: Constants.viewSize.width - 100, y: 5} ) );
    endTypeRadio.right = Constants.viewSize.width - 5;
    this.addChild( speedGroup = new Node( {scale: 0.7, x: pulseButton.right + 20, y: Constants.viewSize.height - 120, children: [
      speedSlow = new AquaRadioButton( model.speedProperty, 0.25, new Text( speedSlowString, {font: new PhetFont( 15 )} ), {radius: 12} ),
      new AquaRadioButton( model.speedProperty, 1, new Text( speedNormalString, {font: new PhetFont( 15 )} ), {radius: 12, x: speedSlow.width + 20} )
    ]} ) );
    this.addChild( new BottomControlPanel( model ) );
    this.addChild( new PlayPauseButton( model, {x: speedGroup.right + 20, y: Constants.viewSize.height - 145} ) );
    this.addChild( new Node( { scale: 0.7, right: Constants.viewSize.width - 5, y: 430, children: [new ResetAllButton( function() { model.reset(); } )] } ) );
    this.addChild( new WOASTLine( model ) );
    this.addChild( new WOASTTimer( model ) );
    this.addChild( new WOASTRulers( model ) );
  }

  inherit( Node, ControlPanel );

  return ControlPanel;
} );
