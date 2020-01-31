// Copyright 2013-2020, University of Colorado Boulder

/**
 * ScreenView for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';

  // modules
  const BottomControlPanel = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/BottomControlPanel' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  const Emitter = require( 'AXON/Emitter' );
  const EndNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/EndNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const ReferenceLine = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/ReferenceLine' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RestartButton = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/RestartButton' );
  const RulerNode = require( 'SCENERY_PHET/RulerNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StartNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/StartNode' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const StopwatchNode = require( 'SCENERY_PHET/StopwatchNode' );
  const StringNode = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/StringNode' );
  const Utils = require( 'DOT/Utils' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  const WOASModel = require( 'WAVE_ON_A_STRING/wave-on-a-string/model/WOASModel' );
  const WOASRadioGroup = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/WOASRadioGroup' );

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

  class WOASScreenView extends ScreenView {
    /**
     * @param {WOASModel} model
     * @param {Tandem} tandem
     */
    constructor( model, tandem ) {
      super( {
        layoutBounds: new Bounds2( 0, 0, 768, 504 )
      } );

      // @private {Emitter} - Fired when a view frame occurs
      this.frameEmitter = new Emitter();

      const centerControlX = Constants.viewSize.width / 2;
      const centerControlY = Constants.viewSize.height - 131;

      const rulerOptions = { minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ), cursor: 'pointer' };
      const horizontalRulerNode = new RulerNode( 800, 50, 80, Utils.rangeInclusive( 0, 10 ).map( n => n + '' ), unitCmString, merge( {
        tandem: tandem.createTandem( 'horizontalRulerNode' )
      }, rulerOptions ) );
      const verticalRulerNode = new RulerNode( 400, 50, 80, Utils.rangeInclusive( 0, 5 ).map( n => n + '' ), unitCmString, merge( {
        tandem: tandem.createTandem( 'verticalRulerNode' )
      }, rulerOptions ) );
      verticalRulerNode.rotate( -Math.PI / 2 );
      this.addChild( horizontalRulerNode );
      this.addChild( verticalRulerNode );

      model.rulersVisibleProperty.link( rulersVisible => {
        horizontalRulerNode.visible = rulersVisible;
        verticalRulerNode.visible = rulersVisible;
      } );
      model.horizontalRulerPositionProperty.link( position => {
        horizontalRulerNode.translation = position;
      } );
      model.verticalRulerPositionProperty.link( position => {
        verticalRulerNode.translation = position;
      } );
      Constants.boundedDragHandler( verticalRulerNode, model.verticalRulerPositionProperty, 30 );
      Constants.boundedDragHandler( horizontalRulerNode, model.horizontalRulerPositionProperty, 30 );

      const radioPanelOptions = {
        fill: '#D9FCC5',
        xMargin: 7,
        yMargin: 7,
        lineWidth: 0.5
      };

      const modePanelTandem = tandem.createTandem( 'modePanel' );
      const endTypePanelTandem = tandem.createTandem( 'endTypePanel' );

      this.addChild( new HBox( {
        children: [
          new Panel( new WOASRadioGroup( model.modeProperty, modePanelTandem.createTandem( 'modeRadioGroup' ), {
            radio: [
              WOASModel.Mode.MANUAL,
              WOASModel.Mode.OSCILLATE,
              WOASModel.Mode.PULSE
            ],
            text: [ manualString, oscillateString, pulseString ]
          } ), merge( {
            tandem: modePanelTandem
          }, radioPanelOptions ) ),
          new RestartButton( model.manualRestart.bind( model ), {
            y: 5
          } )
        ],
        spacing: 10,
        left: 5,
        y: 5,
        align: 'top'
      } ) );

      this.addChild( new Panel( new WOASRadioGroup( model.endTypeProperty, endTypePanelTandem.createTandem( 'endTypeRadioGroup' ), {
        radio: [
          WOASModel.EndType.FIXED_END,
          WOASModel.EndType.LOOSE_END,
          WOASModel.EndType.NO_END
        ],
        text: [ fixedEndString, looseEndString, noEndString ],
        x: Constants.viewSize.width - 100,
        y: 5
      } ), merge( {
        right: Constants.viewSize.width - 5,
        tandem: endTypePanelTandem
      }, radioPanelOptions ) ) );

      this.addChild( new WOASRadioGroup( model.speedProperty, tandem.createTandem( 'speedRadioGroup' ), {
        radio: [
          0.25,
          1
        ],
        text: [ speedSlowString, speedNormalString ],
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
      const playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
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
        isPlayingProperty: model.isPlayingProperty,
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
        listener: () => model.reset(),
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
      model.stopwatchVisibleProperty.link( visible => {
        stopwatchNode.visible = visible;
      } );
      let windowImage;
      //center line
      this.addChild( new Line( 0, 0, 605, 0, {
        stroke: '#FFA91D',
        lineDash: [ 8, 5 ],
        lineWidth: 2,
        x: Constants.startStringNode,
        y: Constants.yStringNode
      } ) );
      const endNode = new EndNode( model, this.frameEmitter, {
        x: Constants.endStringNode,
        y: Constants.yStringNode
      } );
      endNode.windowNode.x += Constants.endStringNode;
      endNode.windowNode.y += Constants.yStringNode;
      this.addChild( endNode.windowNode );
      this.addChild( new ReferenceLine( model ) );
      this.addChild( endNode );
      this.addChild( new StringNode( model, this.frameEmitter, {
        x: Constants.startStringNode,
        y: Constants.yStringNode,
        radius: Constants.segmentStringNodeRadius
      } ) );
      this.addChild( new StartNode( model, this.frameEmitter, {
        x: Constants.startStringNode,
        y: Constants.yStringNode,
        range: Constants.yWrenchRange
      } ) );
      this.addChild( windowImage = new Node( {
        children: [ new Image( windowEdgeImage, {
          left: Constants.windowXOffset - 4 + Constants.windowShift,
          centerY: 0,
          scale: Constants.windowScale
        } ) ], x: Constants.endStringNode, y: Constants.yStringNode
      } ) );

      model.endTypeProperty.link( endType => {
        windowImage.visible = endType === WOASModel.EndType.NO_END;
      } );
    }

    /**
     * Steps forward in time.
     * @public
     *
     * @param {number} dt
     */
    step( dt ) {
      this.frameEmitter.emit();
    }
  }

  return waveOnAString.register( 'WOASScreenView', WOASScreenView );
} );
