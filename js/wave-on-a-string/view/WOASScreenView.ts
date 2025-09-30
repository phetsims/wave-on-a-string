// Copyright 2013-2025, University of Colorado Boulder

/**
 * ScreenView for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
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
import SoundDragListener from '../../../../scenery-phet/js/SoundDragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import MatrixBetweenProperty from '../../../../scenery/js/util/MatrixBetweenProperty.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import windowFront_png from '../../../images/windowFront_png.js';
import waveOnAString from '../../waveOnAString.js';
import WaveOnAStringFluent from '../../WaveOnAStringFluent.js';
import { WOASEndType } from '../model/WOASEndType.js';
import { WOASMode } from '../model/WOASMode.js';
import type WOASModel from '../model/WOASModel.js';
import { MODEL_UNITS_PER_CM, MODEL_UNITS_PER_GAP, NUMBER_OF_BEADS, SCALE_FROM_ORIGINAL, VIEW_END_X, VIEW_ORIGIN_X, VIEW_ORIGIN_Y, windowScale, windowShift, windowXOffset, RULER_MIN_VISIBLE_PX } from '../WOASConstants.js';
import BottomControlPanel from './BottomControlPanel.js';
import EndNode from './EndNode.js';
import ReferenceLine from './ReferenceLine.js';
import RestartButton from './RestartButton.js';
import StartNode from './StartNode.js';
import StringNode from './StringNode.js';
import WOASColors from './WOASColors.js';
import WOASRadioButtonGroup from './WOASRadioButtonGroup.js';
import WOASScreenSummaryContent from './WOASScreenSummaryContent.js';
import WaveGenerationParagraphsNode from './WaveGenerationParagraphsNode.js';

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

    // Tandems used in multiple places
    const toolsTandem = tandem.createTandem( 'tools' );
    const rulersTandem = toolsTandem.createTandem( 'rulersNode' );
    const horizontalRulerTandem = rulersTandem.createTandem( 'horizontalRulerNode' );
    const verticalRulerTandem = rulersTandem.createTandem( 'verticalRulerNode' );

    const rulerOptions = combineOptions<RulerNodeOptions>( {
      minorTicksPerMajorTick: 9,
      unitsFont: new PhetFont( 16 ),
      cursor: 'pointer',
      instrumentUnitsLabelText: false
    }, AccessibleDraggableOptions );

    const viewUnitsPerCM = modelViewTransform.modelToViewDeltaX( MODEL_UNITS_PER_CM );

    const horizontalRulerNode = new ( InteractiveHighlighting( RulerNode ) )( 10 * viewUnitsPerCM, 50, viewUnitsPerCM, rangeInclusive( 0, 10 ).map( n => `${n}` ), WaveOnAStringFluent.unitCmStringProperty, combineOptions<RulerNodeOptions>( {
      tandem: horizontalRulerTandem,
      accessibleName: WaveOnAStringFluent.a11y.horizontalRuler.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.horizontalRuler.accessibleHelpTextStringProperty
    }, rulerOptions ) );
    const verticalRulerNode = new ( InteractiveHighlighting( RulerNode ) )( 5 * viewUnitsPerCM, 50, viewUnitsPerCM, rangeInclusive( 0, 5 ).map( n => `${n}` ), WaveOnAStringFluent.unitCmStringProperty, combineOptions<RulerNodeOptions>( {
      tandem: verticalRulerTandem,
      accessibleName: WaveOnAStringFluent.a11y.verticalRuler.accessibleNameStringProperty,
      accessibleHelpText: WaveOnAStringFluent.a11y.verticalRuler.accessibleHelpTextStringProperty
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

    // Ruler input handling
    {
      // Drag bounds
      const hRulerDragBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
        return visibleBounds.withOffsets(
          horizontalRulerNode.width - RULER_MIN_VISIBLE_PX,
          0,
          -RULER_MIN_VISIBLE_PX,
          -horizontalRulerNode.height
        );
      } );
      const vRulerDragBoundsProperty = new DerivedProperty( [ this.visibleBoundsProperty ], visibleBounds => {
        return visibleBounds.withOffsets(
          0,
          -RULER_MIN_VISIBLE_PX,
          -verticalRulerNode.width,
          -RULER_MIN_VISIBLE_PX + verticalRulerNode.height
        );
      } );

      // Clamp ruler positions when bounds change
      hRulerDragBoundsProperty.link( dragBounds => {
        model.horizontalRulerPositionProperty.value = dragBounds.closestPointTo( model.horizontalRulerPositionProperty.value );
      } );
      vRulerDragBoundsProperty.link( dragBounds => {
        model.verticalRulerPositionProperty.value = dragBounds.closestPointTo( model.verticalRulerPositionProperty.value );
      } );

      model.horizontalRulerPositionProperty.link( position => {
        horizontalRulerNode.translation = position;
      } );
      model.verticalRulerPositionProperty.link( position => {
        verticalRulerNode.translation = position;
      } );

      // Keyboard input
      horizontalRulerNode.addInputListener( new SoundKeyboardDragListener( {
        tandem: horizontalRulerTandem.createTandem( 'keyboardDragListener' ),
        dragSpeed: 300,
        shiftDragSpeed: 20,
        positionProperty: model.horizontalRulerPositionProperty,
        dragBoundsProperty: hRulerDragBoundsProperty
      } ) );
      verticalRulerNode.addInputListener( new SoundKeyboardDragListener( {
        tandem: verticalRulerTandem.createTandem( 'keyboardDragListener' ),
        dragSpeed: 300,
        shiftDragSpeed: 20,
        positionProperty: model.verticalRulerPositionProperty,
        dragBoundsProperty: vRulerDragBoundsProperty
      } ) );

      // Pointer input
      horizontalRulerNode.addInputListener( new SoundDragListener( {
        tandem: horizontalRulerTandem.createTandem( 'dragListener' ),
        positionProperty: model.horizontalRulerPositionProperty,
        dragBoundsProperty: hRulerDragBoundsProperty
      } ) );
      verticalRulerNode.addInputListener( new SoundDragListener( {
        tandem: verticalRulerTandem.createTandem( 'dragListener' ),
        positionProperty: model.verticalRulerPositionProperty,
        dragBoundsProperty: vRulerDragBoundsProperty
      } ) );
    }

    // The string itself
    const stringNode = new StringNode( model, this.frameEmitter, modelViewTransform, {
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    // Dashed center line behind the string
    const centerLine = new Line(
      modelViewTransform.modelToViewX( 0 ),
      modelViewTransform.modelToViewY( 0 ),
      modelViewTransform.modelToViewX( MODEL_UNITS_PER_GAP * ( NUMBER_OF_BEADS - 1 ) ),
      modelViewTransform.modelToViewY( 0 ), {
        stroke: '#6c4a1d',
        lineDash: [ 8, 5 ],
        lineWidth: 2
      } );

    // The left-hand-side StartNode (wrench, oscillator, or pulse generator)
    const startNode = new StartNode( model, this.frameEmitter, {
      scale: SCALE_FROM_ORIGINAL,
      x: VIEW_ORIGIN_X,
      y: VIEW_ORIGIN_Y,
      tandem: tandem.createTandem( 'startNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    // The right-hand-size EndNode (clamp, loose end pole, or no end window)
    const endNode = new EndNode( model, this.frameEmitter, {
      scale: SCALE_FROM_ORIGINAL,
      x: VIEW_END_X,
      y: VIEW_ORIGIN_Y,
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    // We need to extract the window image so it can be layered separately from the EndNode (for in front and behind the string)
    const windowImage = new Node( {
      children: [ new Image( windowFront_png, {
        left: windowXOffset - 4 + windowShift,
        centerY: 0,
        scale: windowScale
      } ) ], x: VIEW_END_X, y: VIEW_ORIGIN_Y, scale: SCALE_FROM_ORIGINAL
    } );
    model.stringEndTypeProperty.link( endType => {
      windowImage.visible = endType === WOASEndType.NO_END;
    } );

    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: toolsTandem.createTandem( 'stopwatchNode' ),
      keyboardDragListenerOptions: {
        dragSpeed: 300,
        shiftDragSpeed: 20
      }
    } );
    stopwatchNode.touchArea = stopwatchNode.localBounds.dilated( 5 );

    // The control panel with the wave property sliders and measurement tool checkboxes
    const bottomControlPanel = new BottomControlPanel( model, tandem.createTandem( 'controlPanel' ) );

    const radioPanelOptions = {
      fill: WOASColors.panelBackgroundColorProperty,
      cornerRadius: 5,
      xMargin: 7,
      yMargin: 7,
      lineWidth: 2 / 3
    };

    const modePanel = new Panel( new WOASRadioButtonGroup( model.waveModeProperty, tandem.createTandem( 'waveModeRadioButtonGroup' ), {
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
    } ), radioPanelOptions );

    const endTypePanel = new Panel( new WOASRadioButtonGroup( model.stringEndTypeProperty, tandem.createTandem( 'endTypeRadioButtonGroup' ), {
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
    } ), radioPanelOptions );

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

    const referenceLine = new ReferenceLine( model, modelViewTransform, toolsTandem.createTandem( 'referenceLineNode' ), referenceLineDragBoundsProperty );

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

    // A11y content for measurement tools (header, and content underneath)
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

    // A11y content for string and wave properties (header, and content underneath)
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

    // A11y content for measurement tools in the control area (header, and content underneath)
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

    const waveGenerationParagraphsNode = new WaveGenerationParagraphsNode( model );

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
      waveGenerationParagraphsNode,
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
      waveGenerationParagraphsNode,
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