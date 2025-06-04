// Copyright 2013-2025, University of Colorado Boulder

/**
 * ScreenView for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import windowFront_png from '../../../images/windowFront_png.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringStrings from '../../WaveOnAStringStrings.js';
import Constants from '../Constants.js';
import { WOASEndType } from '../model/WOASEndType.js';
import { WOASMode } from '../model/WOASMode.js';
import BottomControlPanel from './BottomControlPanel.js';
import EndNode from './EndNode.js';
import ReferenceLine from './ReferenceLine.js';
import RestartButton from './RestartButton.js';
import StartNode from './StartNode.js';
import StringNode from './StringNode.js';
import WOASRadioButtonGroup from './WOASRadioButtonGroup.js';
import type WOASModel from '../model/WOASModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { rangeInclusive } from '../../../../dot/js/util/rangeInclusive.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { MODEL_UNITS_PER_CM, MODEL_UNITS_PER_GAP, NUMBER_OF_BEADS, SCALE_FROM_ORIGINAL, VIEW_END_X, VIEW_ORIGIN_X, VIEW_ORIGIN_Y } from '../WOASConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';

const MARGIN = 10;

class WOASScreenView extends ScreenView {

  // Fired when a view frame occurs
  private readonly frameEmitter: Emitter = new Emitter();

  public constructor( model: WOASModel, tandem: Tandem ) {
    super( {
      tandem: tandem
    } );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleMapping(
      Vector2.ZERO,
      new Vector2( VIEW_ORIGIN_X, VIEW_ORIGIN_Y ),
      SCALE_FROM_ORIGINAL
    );

    const rulersTandem = tandem.createTandem( 'rulersNode' );
    const wavePlayAreaTandem = tandem.createTandem( 'wavePlayArea' );

    const horizontalRulerTandem = rulersTandem.createTandem( 'horizontalRulerNode' );
    const verticalRulerTandem = rulersTandem.createTandem( 'verticalRulerNode' );

    const rulerOptions = {
      minorTicksPerMajorTick: 9,
      unitsFont: new PhetFont( 16 ),
      cursor: 'pointer'
    };

    const viewUnitsPerCM = modelViewTransform.modelToViewDeltaX( MODEL_UNITS_PER_CM );

    const horizontalRulerWidth = 10 * viewUnitsPerCM;
    const verticalRulerHeight = 5 * viewUnitsPerCM;

    const horizontalRulerNode = new RulerNode( horizontalRulerWidth, 50, viewUnitsPerCM, rangeInclusive( 0, 10 ).map( n => `${n}` ), WaveOnAStringStrings.unitCmStringProperty, merge( {
      tandem: horizontalRulerTandem
    }, rulerOptions ) );
    const verticalRulerNode = new RulerNode( verticalRulerHeight, 50, viewUnitsPerCM, rangeInclusive( 0, 5 ).map( n => `${n}` ), WaveOnAStringStrings.unitCmStringProperty, merge( {
      tandem: verticalRulerTandem
    }, rulerOptions ) );
    verticalRulerNode.rotate( -Math.PI / 2 );

    const rulersNode = new Node( {
      children: [
        horizontalRulerNode,
        verticalRulerNode
      ],
      tandem: rulersTandem,
      visibleProperty: model.rulersVisibleProperty
    } );


    model.horizontalRulerPositionProperty.link( position => {
      horizontalRulerNode.translation = position;
    } );
    model.verticalRulerPositionProperty.link( position => {
      verticalRulerNode.translation = position;
    } );

    horizontalRulerNode.addInputListener( new DragListener( {
      tandem: horizontalRulerTandem.createTandem( 'dragListener' ),
      positionProperty: model.horizontalRulerPositionProperty,
      dragBoundsProperty: new Property( this.layoutBounds.dilated( 30 ).shiftedX( -this.layoutBounds.width / 2 ).dilatedX( this.layoutBounds.width * 0.4 ) )
    } ) );

    verticalRulerNode.addInputListener( new DragListener( {
      tandem: verticalRulerTandem.createTandem( 'dragListener' ),
      positionProperty: model.verticalRulerPositionProperty,
      dragBoundsProperty: new Property( this.layoutBounds.withMaxX( this.layoutBounds.maxX - 50 ).withMaxY( this.layoutBounds.maxY * 1.8 ) )
    } ) );

    const radioPanelOptions = {
      fill: '#D9FCC5',
      xMargin: 7,
      yMargin: 7,
      lineWidth: 2 / 3
    };

    const modePanelTandem = tandem.createTandem( 'waveModePanel' );
    const endTypePanelTandem = tandem.createTandem( 'endTypePanel' );

    const stringNode = new StringNode( model, this.frameEmitter, modelViewTransform, {
      tandem: wavePlayAreaTandem.createTandem( 'stringNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    const centerLine = new Line(
      modelViewTransform.modelToViewX( 0 ),
      modelViewTransform.modelToViewY( 0 ),
      modelViewTransform.modelToViewX( MODEL_UNITS_PER_GAP * ( NUMBER_OF_BEADS - 1 ) ),
      modelViewTransform.modelToViewY( 0 ), {
      stroke: '#FFA91D',
      lineDash: [ 8, 5 ],
      lineWidth: 2,
      tandem: wavePlayAreaTandem.createTandem( 'centerLine' )
    } );

    const referenceLine = new ReferenceLine( model, tandem.createTandem( 'referenceLineNode' ), this.layoutBounds );

    const startNode = new StartNode( model, this.frameEmitter, {
      scale: SCALE_FROM_ORIGINAL,
      x: VIEW_ORIGIN_X,
      y: VIEW_ORIGIN_Y,
      range: Constants.yWrenchRange,
      tandem: wavePlayAreaTandem.createTandem( 'startNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    const endNode = new EndNode( model, this.frameEmitter, {
      scale: SCALE_FROM_ORIGINAL,
      x: VIEW_END_X,
      y: VIEW_ORIGIN_Y,
      tandem: wavePlayAreaTandem.createTandem( 'endNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    const windowImage = new Node( {
      children: [ new Image( windowFront_png, {
        left: Constants.windowXOffset - 4 + Constants.windowShift,
        centerY: 0,
        scale: Constants.windowScale
      } ) ], x: VIEW_END_X, y: VIEW_ORIGIN_Y, scale: SCALE_FROM_ORIGINAL
    } );
    model.endTypeProperty.link( endType => {
      windowImage.visible = endType === WOASEndType.NO_END;
    } );

    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' )
    } );
    stopwatchNode.touchArea = stopwatchNode.localBounds.dilated( 5 );

    const bottomControlPanel = new BottomControlPanel( model, tandem.createTandem( 'controlPanel' ) );

    const modePanel = new Panel( new WOASRadioButtonGroup( model.waveModeProperty, modePanelTandem.createTandem( 'radioButtonGroup' ), {
      radio: [
        WOASMode.MANUAL,
        WOASMode.OSCILLATE,
        WOASMode.PULSE
      ],
      text: [
        WaveOnAStringStrings.manualStringProperty,
        WaveOnAStringStrings.oscillateStringProperty,
        WaveOnAStringStrings.pulseStringProperty
      ],
      tandemNames: [
        'manualRadioButton',
        'oscillateRadioButton',
        'pulseRadioButton'
      ]
    } ), combineOptions<PanelOptions>( {
      tandem: modePanelTandem
    }, radioPanelOptions ) );

    const endTypePanel = new Panel( new WOASRadioButtonGroup( model.endTypeProperty, endTypePanelTandem.createTandem( 'radioButtonGroup' ), {
      radio: [
        WOASEndType.FIXED_END,
        WOASEndType.LOOSE_END,
        WOASEndType.NO_END
      ],
      text: [
        WaveOnAStringStrings.fixedEndStringProperty,
        WaveOnAStringStrings.looseEndStringProperty,
        WaveOnAStringStrings.noEndStringProperty
      ],
      tandemNames: [
        'fixedEndRadioButton',
        'looseEndRadioButton',
        'noEndRadioButton'
      ]
    } ), combineOptions<PanelOptions>( {
      tandem: endTypePanelTandem
    }, radioPanelOptions ) );

    const restartButton = new RestartButton( model.manualRestart.bind( model ), {
      tandem: tandem.createTandem( 'restartButton' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        playPauseButtonOptions: {
          scaleFactorWhenNotPlaying: 1.25,
          touchAreaDilation: 12
        },

        stepForwardButtonOptions: {
          listener: model.manualStep.bind( model ),
          touchAreaDilation: 12
        }
      },

      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    ManualConstraint.create( this, [ timeControlNode ], timeControlProxy => {
      timeControlProxy.centerX = this.layoutBounds.width / 2;
      timeControlProxy.centerY = this.layoutBounds.height - 175;
    } );

    const upperLeftBox = new HBox( {
      children: [
        modePanel,
        restartButton
      ],
      spacing: 10,
      align: 'top'
    } );

    this.children = [
      rulersNode,
      new AlignBox( upperLeftBox, {
        alignBounds: this.layoutBounds,
        xAlign: 'left',
        yAlign: 'top',
        margin: MARGIN
      } ),
      new AlignBox( endTypePanel, {
        alignBounds: this.layoutBounds,
        xAlign: 'right',
        yAlign: 'top',
        margin: MARGIN
      } ),
      timeControlNode,
      new AlignBox( resetAllButton, {
        alignBounds: this.layoutBounds,
        xAlign: 'right',
        yAlign: 'bottom',
        margin: MARGIN
      } ),
      new AlignBox( bottomControlPanel, {
        alignBounds: new Bounds2( 0, 0, resetAllButton.left - 10, resetAllButton.bottom ),
        xAlign: 'right',
        yAlign: 'bottom'
      } ),
      stopwatchNode,
      centerLine,
      endNode.windowNode,
      referenceLine,
      endNode,
      stringNode,
      startNode,
      windowImage
    ];
  }

  /**
   * Steps forward in time.
   */
  public override step( dt: number ): void {
    this.frameEmitter.emit();
  }
}

waveOnAString.register( 'WOASScreenView', WOASScreenView );
export default WOASScreenView;