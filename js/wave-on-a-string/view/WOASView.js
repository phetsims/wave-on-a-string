// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var BottomControlPanel = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/BottomControlPanel' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var Emitter = require( 'AXON/Emitter' );
  var EndNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/EndNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var RadioGroup = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/RadioGroup' );
  var ReferenceLine = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/ReferenceLine' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RestartButton = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/RestartButton' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var StartNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/StartNode' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var TheStringNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/TheStringNode' );
  var TimerNode = require( 'SCENERY_PHET/TimerNode' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // images
  var windowEdgeImage = require( 'image!WAVE_ON_A_STRING/window-front.png' );

  // strings
  var fixedEndString = require( 'string!WAVE_ON_A_STRING/fixedEnd' );
  var looseEndString = require( 'string!WAVE_ON_A_STRING/looseEnd' );
  var manualString = require( 'string!WAVE_ON_A_STRING/manual' );
  var noEndString = require( 'string!WAVE_ON_A_STRING/noEnd' );
  var oscillateString = require( 'string!WAVE_ON_A_STRING/oscillate' );
  var pulseString = require( 'string!WAVE_ON_A_STRING/pulse' );
  var speedNormalString = require( 'string!WAVE_ON_A_STRING/speedNormal' );
  var speedSlowString = require( 'string!WAVE_ON_A_STRING/speedSlow' );
  var unitCmString = require( 'string!WAVE_ON_A_STRING/unitCm' );

  function WOASView( model ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    this.frameEmitter = new Emitter();

    var centerControlX = Constants.viewSize.width / 2;
    var centerControlY = Constants.viewSize.height - 131;

    var typeRadio;
    var endTypeRadio;

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
    Constants.boundedDragHandler( rulerV, model.rulerLocVProperty, 30 );
    Constants.boundedDragHandler( rulerH, model.rulerLocHProperty, 30 );

    this.addChild( typeRadio = new RadioGroup( model.modeProperty, {
      radio: [ 'manual', 'oscillate', 'pulse' ],
      text: [ manualString, oscillateString, pulseString ],
      x: 5,
      y: 5
    } ) );
    this.addChild( new RestartButton( model, { x: typeRadio.right + 10, y: 5 } ) );
    this.addChild( endTypeRadio = new RadioGroup( model.typeEndProperty, {
      radio: [ 'fixedEnd', 'looseEnd', 'noEnd' ],
      text: [ fixedEndString, looseEndString, noEndString ],
      x: Constants.viewSize.width - 100,
      y: 5
    } ) );
    endTypeRadio.right = Constants.viewSize.width - 5;
    this.addChild( new RadioGroup( model.speedProperty, {
      radio: [ 0.25, 1 ],
      text: [ speedSlowString, speedNormalString ],
      omitPanel: true,
      right: centerControlX - 30,
      centerY: centerControlY
    } ) );

    var playPauseButtonOptions = {
      upFill: Constants.blueUpColor,
      overFill: Constants.blueOverColor,
      disabledFill: Constants.blueDisabledColor,
      downFill: Constants.blueDownColor,
      backgroundGradientColorStop0: Constants.buttonBorder0,
      backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };
    var playPauseButton = new PlayPauseButton( model.playProperty, {
      x: centerControlX + 45,
      centerY: centerControlY,
      scale: 0.6,
      touchAreaDilation: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );
    this.addChild( playPauseButton );
    var pauseSizeIncreaseFactor = 1.25;
    model.playProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );
    this.addChild( new StepForwardButton( {
      isPlayingProperty: model.playProperty,
      listener: model.manualStep.bind( model ),
      x: centerControlX + 94,
      centerY: centerControlY,
      scale: 0.6,
      touchAreaDilation: 12,
      upFill: Constants.blueUpColor,
      overFill: Constants.blueOverColor,
      disabledFill: Constants.blueDisabledColor,
      downFill: Constants.blueDownColor,
      backgroundGradientColorStop0: Constants.buttonBorder0,
      backgroundGradientColorStop1: Constants.buttonBorder1
    } ) );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    resetAllButton.scale( 0.924 );
    this.addChild( resetAllButton );

    var bottomControlPanel = new BottomControlPanel( model );
    this.addChild( bottomControlPanel );

    bottomControlPanel.right = resetAllButton.left - 10;
    bottomControlPanel.bottom = resetAllButton.bottom;
    /*---------------------------------------------------------------------------*
     * TimerNode
     *----------------------------------------------------------------------------*/
    var timer = new TimerNode( model.timerSecondProperty, model.timerStartProperty );
    timer.touchArea = timer.localBounds.dilated( 5 );
    this.addChild( timer );
    model.timerProperty.link( function updateVisible( value ) {
      timer.setVisible( value );
    } );
    // timer drag handling
    model.timerLocProperty.link( function updateLocation( value ) {
      timer.translation = value;
    } );
    var clickOffset = new Vector2( 0, 0 );
    var restrictedBounds = Constants.viewBounds.eroded( 30 );
    timer.dragTarget.addInputListener( new SimpleDragHandler( {
      start: function( event ) {
        clickOffset = timer.dragTarget.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
      },
      drag: function( event ) {
        model.timerLocProperty.set( timer.globalToParentPoint( event.pointer.point ).minus( clickOffset ) );
        if ( timer.right < restrictedBounds.minX ) {
          model.timerLocProperty.set(
            new Vector2( model.timerLocProperty.get().x - timer.right + restrictedBounds.minX, model.timerLocProperty.get().y ) );
        }
        if ( timer.left > restrictedBounds.maxX ) {
          model.timerLocProperty.set( new Vector2( model.timerLocProperty.get().x -
                                                   timer.left + restrictedBounds.maxX, model.timerLocProperty.get().y ) );
        }
        if ( timer.bottom < restrictedBounds.minY ) {
          model.timerLocProperty.set(
            new Vector2( model.timerLocProperty.get().x, model.timerLocProperty.get().y - timer.bottom + restrictedBounds.minY ) );
        }
        if ( timer.top > restrictedBounds.maxY ) {
          model.timerLocProperty.set(
            new Vector2( model.timerLocProperty.get().x, model.timerLocProperty.get().y - timer.top + restrictedBounds.maxY ) );
        }
      }
    } ) );

    var windowImage;
    //center line
    this.addChild( new Line( 0, 0, 605, 0, {
      stroke: '#FFA91D',
      lineDash: [ 8, 5 ],
      lineWidth: 2,
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode
    } ) );
    var endNode = new EndNode( model, this.frameEmitter, { x: Constants.endTheStringNode, y: Constants.yTheStringNode } );
    endNode.windowNode.x += Constants.endTheStringNode;
    endNode.windowNode.y += Constants.yTheStringNode;
    this.addChild( endNode.windowNode );
    this.addChild( new ReferenceLine( model ) );
    this.addChild( endNode );
    this.addChild( new TheStringNode( model, this.frameEmitter, {
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode,
      radius: Constants.segmentTheStringNodeRadius
    } ) );
    this.addChild( new StartNode( model, this.frameEmitter, {
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode,
      range: Constants.yWrenchRange
    } ) );
    this.addChild( windowImage = new Node( {
      children: [ new Image( windowEdgeImage, {
        left: Constants.windowXOffset - 4 + Constants.windowShift,
        centerY: 0,
        scale: Constants.windowScale
      } ) ], x: Constants.endTheStringNode, y: Constants.yTheStringNode
    } ) );

    model.typeEndProperty.link( function updateVisible( value ) {
      windowImage.setVisible( value === 'noEnd' );
    } );
  }

  waveOnAString.register( 'WOASView', WOASView );

  inherit( ScreenView, WOASView, {
    step: function( time ) {
      this.frameEmitter.emit();
    }
  } );
  return WOASView;
} );
