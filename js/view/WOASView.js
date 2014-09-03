/**
 * Copyright 2002-2013, University of Colorado
 * Main view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Events = require( 'AXON/Events' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Line = require( 'SCENERY/nodes/Line' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var PlayPauseButton = require( 'SCENERY_PHET/PlayPauseButton' );
  var StepButton = require( 'SCENERY_PHET/StepButton' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var BottomControlPanel = require( 'WOAS/view/control/BottomControlPanel' );
  var RadioGroup = require( 'WOAS/view/control/RadioGroup' );
  var RestartButton = require( 'WOAS/view/control/RestartButton' );
  var Timer = require( 'WOAS/view/control/Timer' );
  var Constants = require( 'WOAS/Constants' );
  var TheStringNode = require( 'WOAS/view/action/TheStringNode' );
  var StartNode = require( 'WOAS/view/action/StartNode' );
  var EndNode = require( 'WOAS/view/action/EndNode' );
  var ReferenceLine = require( 'WOAS/view/control/ReferenceLine' );

  // images
  var windowEdgeImage = require( 'image!WOAS/window-front.svg' );
  windowEdgeImage.width = 18;
  windowEdgeImage.height = 395;

  // strings
  var speedSlowString = require( 'string!WOAS/speedSlow' );
  var speedNormalString = require( 'string!WOAS/speedNormal' );
  var manualString = require( 'string!WOAS/manual' );
  var oscillateString = require( 'string!WOAS/oscillate' );
  var pulseString = require( 'string!WOAS/pulse' );
  var fixedEndString = require( 'string!WOAS/fixedEnd' );
  var looseEndString = require( 'string!WOAS/looseEnd' );
  var noEndString = require( 'string!WOAS/noEnd' );
  var unitCmString = require( 'string!WOAS/unitCm' );

  function WOASView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    this.events = new Events();

    var typeRadio, endTypeRadio, speedSlow, speedFast, speedGroup;

    var rulerOptions = { minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ), cursor: 'pointer' };
    var rulerH = new RulerNode( 800, 50, 80, Util.rangeInclusive( 0, 10 ).map( function( n ) { return n + ''; } ), unitCmString, rulerOptions );
    var rulerV = new RulerNode( 400, 50, 80, Util.rangeInclusive( 0, 5 ).map( function( n ) { return n + ''; } ), unitCmString, rulerOptions );
    rulerV.rotate( -Math.PI / 2 );
    this.addChild( rulerH );
    this.addChild( rulerV );

    model.rulersProperty.link( function updateRulersVisible( value ) {
      rulerH.setVisible( value );
      rulerV.setVisible( value );
    } );
    model.rulerLocHProperty.link( function updateRulerHLocation( value ) {
      rulerH.translation = value;
    } );
    model.rulerLocVProperty.link( function updateRulerVLocation( value ) {
      rulerV.translation = value;
    } );
    rulerV.addInputListener( Constants.dragAndDropHandler( rulerV, function( point ) {model.rulerLocV = point; } ) );
    rulerH.addInputListener( Constants.dragAndDropHandler( rulerH, function( point ) {model.rulerLocH = point; } ) );

    this.addChild( typeRadio = new RadioGroup( {radio: ['manual', 'oscillate', 'pulse'], text: [manualString, oscillateString, pulseString], property: model.modeProperty, x: 5, y: 5} ) );
    this.addChild( new RestartButton( model, {x: typeRadio.right + 10, y: 5} ) );
    this.addChild( endTypeRadio = new RadioGroup( {radio: ['fixedEnd', 'looseEnd', 'noEnd'], text: [fixedEndString, looseEndString, noEndString], property: model.typeEndProperty, x: Constants.viewSize.width - 100, y: 5} ) );
    endTypeRadio.right = Constants.viewSize.width - 5;
    this.addChild( speedGroup = new Node( {scale: 0.7, x: 140 + 100, y: Constants.viewSize.height - 131, children: [
      speedSlow = new AquaRadioButton( model.speedProperty, 0.25, new Text( speedSlowString, {font: new PhetFont( 15 )} ), {radius: 12, selectedColor: Constants.radioColor } ),
      speedFast = new AquaRadioButton( model.speedProperty, 1, new Text( speedNormalString, {font: new PhetFont( 15 )} ), {radius: 12, x: speedSlow.width + 20, selectedColor: Constants.radioColor } )
    ]} ) );
    speedSlow.touchArea = Shape.bounds( Bounds2.rect( -14, -speedSlow.height / 2, speedSlow.width + 5, speedSlow.height ).dilatedXY( 5, 15 ) );
    speedSlow.mouseArea = Shape.bounds( Bounds2.rect( -14, -speedSlow.height / 2, speedSlow.width + 5, speedSlow.height ) );
    speedFast.touchArea = Shape.bounds( Bounds2.rect( -14, -speedFast.height / 2, speedFast.width + 5, speedFast.height ).dilatedXY( 5, 15 ) );
    speedFast.mouseArea = Shape.bounds( Bounds2.rect( -14, -speedFast.height / 2, speedFast.width + 5, speedFast.height ) );
    this.addChild( new BottomControlPanel( model ) );
    var playPauseButtonOptions = {
      upFill: Constants.blueUpColor,
      overFill: Constants.blueOverColor,
      disabledFill: Constants.blueDisabledColor,
      downFill: Constants.blueDownColor,
      backgroundGradientColorStop0: Constants.buttonBorder0,
      backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };
    this.addChild( new PlayPauseButton( model.playProperty, {
      x: speedGroup.right + 45,
      y: speedGroup.centerY,
      scale: 0.6,
      touchExpansion: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } ) );
    this.addChild( new StepButton( model.manualStep.bind( model ), model.playProperty, {
      x: speedGroup.right + 88,
      y: speedGroup.centerY,
      scale: 0.6,
      touchExpansion: 12,
      upFill: Constants.blueUpColor,
      overFill: Constants.blueOverColor,
      disabledFill: Constants.blueDisabledColor,
      downFill: Constants.blueDownColor,
      backgroundGradientColorStop0: Constants.buttonBorder0,
      backgroundGradientColorStop1: Constants.buttonBorder1
    } ) );
    this.addChild( new Node( { scale: 0.7, right: Constants.viewSize.width - 5, bottom: Constants.viewSize.height - 10, children: [
      new ResetAllButton( {
        scale: 1.32,
        listener: function() { model.reset(); }
      } )
    ] } ) );

    /*---------------------------------------------------------------------------*
    * Timer
    *----------------------------------------------------------------------------*/
    var timer = new Timer( model.timerSecondProperty, model.timerStartProperty, {} );
    this.addChild( timer );
    model.timerProperty.link( function updateVisible( value ) {
      timer.setVisible( value );
    } );
    // timer drag handling
    model.timerLocProperty.link( function updateLocation( value ) {
      timer.translation = value;
    } );
    var clickOffset = new Vector2();
    timer.dragTarget.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        clickOffset = timer.dragTarget.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
      },
      drag: function( event ) {
        model.timerLoc = timer.globalToParentPoint( event.pointer.point ).minus( clickOffset );
      }
    } ) );

    var windowImage;
    //center line
    this.addChild( new Line( 0, 0, 605, 0, {
      stroke: '#FFA91D',
      lineDash: [8, 5],
      lineWidth: 2,
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode
    } ) );
    var endNode = new EndNode( model, this.events, {x: Constants.endTheStringNode, y: Constants.yTheStringNode} );
    endNode.windowNode.x += Constants.endTheStringNode;
    endNode.windowNode.y += Constants.yTheStringNode;
    this.addChild( endNode.windowNode );
    this.addChild( new ReferenceLine( model ) );
    this.addChild( endNode );
    this.addChild( new TheStringNode( model, this.events, {x: Constants.startTheStringNode, y: Constants.yTheStringNode, radius: Constants.segmentTheStringNodeRadius} ) );
    this.addChild( new StartNode( model, this.events, {x: Constants.startTheStringNode, y: Constants.yTheStringNode, range: Constants.yWrenchRange} ) );
    this.addChild( windowImage = new Node( {children: [new Image( windowEdgeImage, {left: Constants.windowXOffset - 4 + Constants.windowShift, centerY: 0, scale: Constants.windowScale} )], x: Constants.endTheStringNode, y: Constants.yTheStringNode} ) );

    model.typeEndProperty.link( function updateVisible( value ) {
      windowImage.setVisible( value === 'noEnd' );
    } );
  }

  inherit( ScreenView, WOASView, {
    step: function( time ) {
      this.events.trigger( 'frame' );
    }
  } );
  return WOASView;
} );
