// Copyright 2013-2025, University of Colorado Boulder

/**
 * ScreenView for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { rangeInclusive } from '../../../../dot/js/util/rangeInclusive.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode, { RulerNodeOptions } from '../../../../scenery-phet/js/RulerNode.js';
import SoundKeyboardDragListener from '../../../../scenery-phet/js/SoundKeyboardDragListener.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import MatrixBetweenProperty from '../../../../scenery/js/util/MatrixBetweenProperty.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import windowFront_png from '../../../images/windowFront_png.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import { WOASEndType } from '../model/WOASEndType.js';
import { WOASMode } from '../model/WOASMode.js';
import type WOASModel from '../model/WOASModel.js';
import { MODEL_UNITS_PER_CM, MODEL_UNITS_PER_GAP, NUMBER_OF_BEADS, SCALE_FROM_ORIGINAL, VIEW_END_X, VIEW_ORIGIN_X, VIEW_ORIGIN_Y, windowScale, windowShift, windowXOffset } from '../WOASConstants.js';
import BottomControlPanel from './BottomControlPanel.js';
import EndNode from './EndNode.js';
import ReferenceLine from './ReferenceLine.js';
import RestartButton from './RestartButton.js';
import StartNode from './StartNode.js';
import StringNode from './StringNode.js';
import WOASColors from './WOASColors.js';
import WOASRadioButtonGroup from './WOASRadioButtonGroup.js';
import WOASScreenSummaryContent from './WOASScreenSummaryContent.js';

const MARGIN = 10;

class WOASScreenView extends ScreenView {

  // Fired when a view frame occurs
  private readonly frameEmitter: Emitter = new Emitter();

  public constructor( model: WOASModel, tandem: Tandem ) {
    super( {
      tandem: tandem,
      screenSummaryContent: new WOASScreenSummaryContent( model )
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

    const rulerOptions = combineOptions<RulerNodeOptions>( {
      minorTicksPerMajorTick: 9,
      unitsFont: new PhetFont( 16 ),
      cursor: 'pointer'
    }, AccessibleDraggableOptions );

    const viewUnitsPerCM = modelViewTransform.modelToViewDeltaX( MODEL_UNITS_PER_CM );

    const horizontalRulerWidth = 10 * viewUnitsPerCM;
    const verticalRulerHeight = 5 * viewUnitsPerCM;

    const horizontalRulerNode = new ( InteractiveHighlighting( RulerNode ) )( horizontalRulerWidth, 50, viewUnitsPerCM, rangeInclusive( 0, 10 ).map( n => `${n}` ), WaveOnAStringFluent.unitCmStringProperty, combineOptions<RulerNodeOptions>( {
      tandem: horizontalRulerTandem,
      accessibleName: WaveOnAStringFluent.a11y.horizontalRuler.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.horizontalRuler.accessibleHelpTextStringProperty
    }, rulerOptions ) );
    const verticalRulerNode = new ( InteractiveHighlighting( RulerNode ) )( verticalRulerHeight, 50, viewUnitsPerCM, rangeInclusive( 0, 5 ).map( n => `${n}` ), WaveOnAStringFluent.unitCmStringProperty, combineOptions<RulerNodeOptions>( {
      tandem: verticalRulerTandem,
      accessibleName: WaveOnAStringFluent.a11y.verticalRuler.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.verticalRuler.accessibleHelpTextStringProperty
    }, rulerOptions ) );
    verticalRulerNode.rotate( -Math.PI / 2 );

    horizontalRulerNode.addInputListener( new SoundKeyboardDragListener( {
      tandem: horizontalRulerTandem.createTandem( 'keyboardDragListener' ),
      dragSpeed: 300,
      shiftDragSpeed: 20,
      positionProperty: model.horizontalRulerPositionProperty
    } ) );

    verticalRulerNode.addInputListener( new SoundKeyboardDragListener( {
      tandem: verticalRulerTandem.createTandem( 'keyboardDragListener' ),
      dragSpeed: 300,
      shiftDragSpeed: 20,
      positionProperty: model.verticalRulerPositionProperty
    } ) );

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
      fill: WOASColors.panelBackgroundColorProperty,
      cornerRadius: 5,
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

    const startNode = new StartNode( model, this.frameEmitter, {
      scale: SCALE_FROM_ORIGINAL,
      x: VIEW_ORIGIN_X,
      y: VIEW_ORIGIN_Y,
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
        left: windowXOffset - 4 + windowShift,
        centerY: 0,
        scale: windowScale
      } ) ], x: VIEW_END_X, y: VIEW_ORIGIN_Y, scale: SCALE_FROM_ORIGINAL
    } );
    model.endTypeProperty.link( endType => {
      windowImage.visible = endType === WOASEndType.NO_END;
    } );

    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' ),
      keyboardDragListenerOptions: {
        dragSpeed: 300,
        shiftDragSpeed: 20
      }
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
        WaveOnAStringFluent.manualStringProperty,
        WaveOnAStringFluent.oscillateStringProperty,
        WaveOnAStringFluent.pulseStringProperty
      ],
      tandemNames: [
        'manualRadioButton',
        'oscillateRadioButton',
        'pulseRadioButton'
      ],
      accessibleNames: [
        WaveOnAStringFluent.a11y.waveMode.manual.accessibleNameStringProperty,
        WaveOnAStringFluent.a11y.waveMode.oscillate.accessibleNameStringProperty,
        WaveOnAStringFluent.a11y.waveMode.pulse.accessibleNameStringProperty
      ],
      accessibleName: WaveOnAStringFluent.a11y.waveMode.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.waveMode.accessibleHelpTextStringProperty
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
        WaveOnAStringFluent.fixedEndStringProperty,
        WaveOnAStringFluent.looseEndStringProperty,
        WaveOnAStringFluent.noEndStringProperty
      ],
      tandemNames: [
        'fixedEndRadioButton',
        'looseEndRadioButton',
        'noEndRadioButton'
      ],
      accessibleNames: [
        WaveOnAStringFluent.a11y.endMode.fixedEnd.accessibleNameStringProperty,
        WaveOnAStringFluent.a11y.endMode.looseEnd.accessibleNameStringProperty,
        WaveOnAStringFluent.a11y.endMode.noEnd.accessibleNameStringProperty
      ],
      accessibleName: WaveOnAStringFluent.a11y.endMode.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.endMode.accessibleHelpTextStringProperty
    } ), combineOptions<PanelOptions>( {
      tandem: endTypePanelTandem
    }, radioPanelOptions ) );

    // Don't let the reference line go below the bottom control panel
    const lowerReferenceLineBoundaryProperty: TReadOnlyProperty<number> = new DerivedProperty( [
      bottomControlPanel.localBoundsProperty,
      new MatrixBetweenProperty( bottomControlPanel, this )
    ], (
      bottomControlPanelLocalBounds,
      toScreenViewMatrix
    ) => {
      if ( toScreenViewMatrix ) {
        return bottomControlPanelLocalBounds.transformed( toScreenViewMatrix ).top;
      }
      else {
        // If they aren't connected yet, return the bottom of the screen
        return this.layoutBounds.bottom;
      }
    } );

    // Don't let the reference line go into the mode panel or end type panel
    const upperReferenceLineBoundaryProperty: TReadOnlyProperty<number> = new DerivedProperty( [
      modePanel.localBoundsProperty,
      new MatrixBetweenProperty( modePanel, this ),
      endTypePanel.localBoundsProperty,
      new MatrixBetweenProperty( endTypePanel, this )
    ], (
      modePanelLocalBounds,
      modePanelToScreenViewMatrix,
      endTypePanelLocalBounds,
      endTypePanelToScreenViewMatrix
    ) => {
      let top = this.layoutBounds.top;

      if ( modePanelToScreenViewMatrix ) {
        top = Math.max( top, modePanelLocalBounds.transformed( modePanelToScreenViewMatrix ).bottom );
      }
      if ( endTypePanelToScreenViewMatrix ) {
        top = Math.max( top, endTypePanelLocalBounds.transformed( endTypePanelToScreenViewMatrix ).bottom );
      }

      return top;
    } );

    const referenceLineDragBoundsProperty = new DerivedProperty( [
      lowerReferenceLineBoundaryProperty,
      upperReferenceLineBoundaryProperty
    ], ( lower, upper ) => {
      return new Bounds2(
        this.layoutBounds.left + 30 - this.layoutBounds.width,
        upper + 10,
        this.layoutBounds.right - 30 + this.layoutBounds.width,
        lower - 10
      );
    } );

    const referenceLine = new ReferenceLine( model, modelViewTransform, tandem.createTandem( 'referenceLineNode' ), referenceLineDragBoundsProperty );

    const restartButton = new RestartButton( model.manualRestart.bind( model ), {
      tandem: tandem.createTandem( 'restartButton' )
    } );
    ManualConstraint.create( this, [ restartButton ], restartButtonProxy => {
      restartButtonProxy.centerX = 0.23 * this.layoutBounds.width;
      restartButtonProxy.centerY = this.layoutBounds.height - 175;
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

    const playAreaActiveMeasurementToolsNode = new Node( {
      children: [],
      accessibleHeading: WaveOnAStringFluent.a11y.headings.playArea.activeMeasurementToolsStringProperty,
      descriptionTagName: 'p',
      descriptionContent: WaveOnAStringFluent.a11y.headings.playArea.activeMeasurementToolsDescriptionStringProperty,
      pdomOrder: [
        horizontalRulerNode,
        verticalRulerNode,
        stopwatchNode,
        referenceLine
      ],
      // Hide section when none are visible, see https://github.com/phetsims/wave-on-a-string/issues/170
      visibleProperty: DerivedProperty.or( [
        model.rulersVisibleProperty,
        model.stopwatch.isVisibleProperty,
        model.referenceLineVisibleProperty
      ] )
    } );

    const playAreaWaveAndStringPropertiesNode = new Node( {
      children: [],
      accessibleHeading: WaveOnAStringFluent.a11y.headings.playArea.waveAndStringPropertiesStringProperty,
      descriptionTagName: 'p',
      descriptionContent: WaveOnAStringFluent.a11y.headings.playArea.waveAndStringPropertiesDescriptionStringProperty,
      pdomOrder: [
        bottomControlPanel.amplitudeControl,
        bottomControlPanel.frequencyControl,
        bottomControlPanel.pulseWidthControl,
        bottomControlPanel.dampingControl,
        bottomControlPanel.tensionControl
      ]
    } );

    const controlAreaMeasurementToolsNode = new Node( {
      children: [],
      accessibleHeading: WaveOnAStringFluent.a11y.headings.controlArea.measurementToolsStringProperty,
      descriptionTagName: 'p',
      descriptionContent: WaveOnAStringFluent.a11y.headings.controlArea.measurementToolsDescriptionStringProperty,
      pdomOrder: [
        bottomControlPanel.checkboxGroup,
        resetAllButton
      ]
    } );

    this.children = [
      playAreaActiveMeasurementToolsNode,
      playAreaWaveAndStringPropertiesNode,
      controlAreaMeasurementToolsNode,
      rulersNode,
      new AlignBox( modePanel, {
        alignBounds: this.layoutBounds,
        xAlign: 'left',
        yAlign: 'top',
        margin: MARGIN
      } ),
      restartButton,
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

    this.pdomPlayAreaNode.pdomOrder = [
      modePanel,
      endTypePanel,
      startNode.wrench,
      startNode.pulseButton,
      restartButton,
      timeControlNode,
      playAreaActiveMeasurementToolsNode,
      playAreaWaveAndStringPropertiesNode
    ];

    this.pdomControlAreaNode.pdomOrder = [
      controlAreaMeasurementToolsNode
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