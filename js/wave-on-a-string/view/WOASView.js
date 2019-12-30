// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';
  const BottomControlPanel = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/BottomControlPanel' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Emitter = require( 'AXON/Emitter' );
  const EndNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/EndNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const RadioGroup = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/RadioGroup' );
  const ReferenceLine = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/ReferenceLine' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RestartButton = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/RestartButton' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StartNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/StartNode' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const TheStringNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/action/TheStringNode' );
  const StopwatchNode = require( 'SCENERY_PHET/StopwatchNode' );
  const Utils = require( 'DOT/Utils' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  // images
  const windowEdgeImage = require( 'image!WAVE_ON_A_STRING/window-front.png' );

  // strings
  const fixedEndString = require( 'string!WAVE_ON_A_STRING/fixedEnd' );
  const looseEndString = require( 'string!WAVE_ON_A_STRING/looseEnd' );
  const manualString = require( 'string!WAVE_ON_A_STRING/manual' );
  const noEndString = require( 'string!WAVE_ON_A_STRING/noEnd' );
  const oscillateString = require( 'string!WAVE_ON_A_STRING/oscillate' );
  const pulseString = require( 'string!WAVE_ON_A_STRING/pulse' );
  const speedNormalString = require( 'string!WAVE_ON_A_STRING/speedNormal' );
  const speedSlowString = require( 'string!WAVE_ON_A_STRING/speedSlow' );
  const unitCmString = require( 'string!WAVE_ON_A_STRING/unitCm' );

  function WOASView( model ) {
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    this.frameEmitter = new Emitter();

    const centerControlX = Constants.viewSize.width / 2;
    const centerControlY = Constants.viewSize.height - 131;

    let typeRadio;
    let endTypeRadio;

    const rulerOptions = { minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ), cursor: 'pointer' };
    const rulerH = new RulerNode( 800, 50, 80, Utils.rangeInclusive( 0, 10 ).map( function( n ) { return n + ''; } ), unitCmString, rulerOptions );
    const rulerV = new RulerNode( 400, 50, 80, Utils.rangeInclusive( 0, 5 ).map( function( n ) { return n + ''; } ), unitCmString, rulerOptions );
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

    const playPauseButtonOptions = {
      upFill: Constants.blueUpColor,
      overFill: Constants.blueOverColor,
      disabledFill: Constants.blueDisabledColor,
      downFill: Constants.blueDownColor,
      backgroundGradientColorStop0: Constants.buttonBorder0,
      backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };
    const playPauseButton = new PlayPauseButton( model.playProperty, {
      x: centerControlX + 45,
      centerY: centerControlY,
      scale: 0.6,
      scaleFactorWhenPaused: 1.25,
      touchAreaDilation: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );
    this.addChild( playPauseButton );

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

    const resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    resetAllButton.scale( 0.924 );
    this.addChild( resetAllButton );

    const bottomControlPanel = new BottomControlPanel( model );
    this.addChild( bottomControlPanel );

    bottomControlPanel.right = resetAllButton.left - 10;
    bottomControlPanel.bottom = resetAllButton.bottom;
    /*---------------------------------------------------------------------------*
     * StopwatchNode
     *----------------------------------------------------------------------------*/
    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      visibleBoundsProperty: this.visibleBoundsProperty
    } );
    stopwatchNode.touchArea = stopwatchNode.localBounds.dilated( 5 );
    this.addChild( stopwatchNode );
    model.timerProperty.link( function updateVisible( value ) {
      stopwatchNode.setVisible( value );
    } );
    let windowImage;
    //center line
    this.addChild( new Line( 0, 0, 605, 0, {
      stroke: '#FFA91D',
      lineDash: [ 8, 5 ],
      lineWidth: 2,
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode
    } ) );
    const endNode = new EndNode( model, this.frameEmitter, {
      x: Constants.endTheStringNode,
      y: Constants.yTheStringNode
    } );
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
