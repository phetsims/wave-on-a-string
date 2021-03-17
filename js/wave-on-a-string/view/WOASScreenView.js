// Copyright 2013-2020, University of Colorado Boulder

/**
 * ScreenView for Wave on a String
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RulerNode from '../../../../scenery-phet/js/RulerNode.js';
import StopwatchNode from '../../../../scenery-phet/js/StopwatchNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import windowEdgeImage from '../../../images/window-front_png.js';
import waveOnAString from '../../waveOnAString.js';
import waveOnAStringStrings from '../../waveOnAStringStrings.js';
import Constants from '../Constants.js';
import WOASModel from '../model/WOASModel.js';
import BottomControlPanel from './BottomControlPanel.js';
import EndNode from './EndNode.js';
import ReferenceLine from './ReferenceLine.js';
import RestartButton from './RestartButton.js';
import StartNode from './StartNode.js';
import StringNode from './StringNode.js';
import WOASRadioButtonGroup from './WOASRadioButtonGroup.js';

const fixedEndString = waveOnAStringStrings.fixedEnd;
const looseEndString = waveOnAStringStrings.looseEnd;
const manualString = waveOnAStringStrings.manual;
const noEndString = waveOnAStringStrings.noEnd;
const oscillateString = waveOnAStringStrings.oscillate;
const pulseString = waveOnAStringStrings.pulse;
const unitCmString = waveOnAStringStrings.unitCm;

class WOASScreenView extends ScreenView {
  /**
   * @param {WOASModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( {
      layoutBounds: Constants.VIEW_BOUNDS,
      tandem: tandem
    } );

    // @private {Emitter} - Fired when a view frame occurs
    this.frameEmitter = new Emitter();

    const rulersTandem = tandem.createTandem( 'rulersNode' );
    const wavePlayAreaTandem = tandem.createTandem( 'wavePlayArea' );

    const horizontalRulerTandem = rulersTandem.createTandem( 'horizontalRulerNode' );
    const verticalRulerTandem = rulersTandem.createTandem( 'verticalRulerNode' );

    const rulerOptions = { minorTicksPerMajorTick: 4, unitsFont: new PhetFont( 16 ), cursor: 'pointer' };
    const horizontalRulerNode = new RulerNode( 800, 50, 80, Utils.rangeInclusive( 0, 10 ).map( n => `${n}` ), unitCmString, merge( {
      tandem: horizontalRulerTandem
    }, rulerOptions ) );
    const verticalRulerNode = new RulerNode( 400, 50, 80, Utils.rangeInclusive( 0, 5 ).map( n => `${n}` ), unitCmString, merge( {
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
    this.addChild( rulersNode );

    model.horizontalRulerPositionProperty.link( position => {
      horizontalRulerNode.translation = position;
    } );
    model.verticalRulerPositionProperty.link( position => {
      verticalRulerNode.translation = position;
    } );

    horizontalRulerNode.addInputListener( new DragListener( {
      tandem: horizontalRulerTandem.createTandem( 'inputListener' ),
      positionProperty: model.horizontalRulerPositionProperty,
      dragBoundsProperty: new Property( Constants.VIEW_BOUNDS.dilated( 30 ).shiftedX( -Constants.VIEW_BOUNDS.width / 2 ).dilatedX( Constants.VIEW_BOUNDS.width * 0.4 ) )
    } ) );

    verticalRulerNode.addInputListener( new DragListener( {
      tandem: verticalRulerTandem.createTandem( 'inputListener' ),
      positionProperty: model.verticalRulerPositionProperty,
      dragBoundsProperty: new Property( Constants.VIEW_BOUNDS.withMaxX( Constants.VIEW_BOUNDS.maxX - 50 ).withMaxY( Constants.VIEW_BOUNDS.maxY * 1.8 ) )
    } ) );

    const radioPanelOptions = {
      fill: '#D9FCC5',
      xMargin: 7,
      yMargin: 7,
      lineWidth: 0.5
    };

    const modePanelTandem = tandem.createTandem( 'waveModePanel' );
    const endTypePanelTandem = tandem.createTandem( 'endTypePanel' );

    this.addChild( new HBox( {
      children: [
        new Panel( new WOASRadioButtonGroup( model.waveModeProperty, modePanelTandem.createTandem( 'radioButtonGroup' ), {
          radio: [
            WOASModel.Mode.MANUAL,
            WOASModel.Mode.OSCILLATE,
            WOASModel.Mode.PULSE
          ],
          text: [ manualString, oscillateString, pulseString ],
          tandemNames: [
            'manualRadioButton',
            'oscillateRadioButton',
            'pulseRadioButton'
          ]
        } ), merge( {
          tandem: modePanelTandem
        }, radioPanelOptions ) ),
        new RestartButton( model.manualRestart.bind( model ), {
          y: 5,
          tandem: tandem.createTandem( 'restartButton' )
        } )
      ],
      spacing: 10,
      left: 5,
      y: 5,
      align: 'top'
    } ) );

    this.addChild( new Panel( new WOASRadioButtonGroup( model.endTypeProperty, endTypePanelTandem.createTandem( 'radioButtonGroup' ), {
      radio: [
        WOASModel.EndType.FIXED_END,
        WOASModel.EndType.LOOSE_END,
        WOASModel.EndType.NO_END
      ],
      text: [ fixedEndString, looseEndString, noEndString ],
      tandemNames: [
        'fixedEndRadioButton',
        'looseEndRadioButton',
        'noEndRadioButton'
      ],
      x: Constants.VIEW_BOUNDS.width - 100,
      y: 5
    } ), merge( {
      right: Constants.VIEW_BOUNDS.width - 5,
      tandem: endTypePanelTandem
    }, radioPanelOptions ) ) );

    this.addChild( new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: model.timeSpeedProperty,
      playPauseStepButtonOptions: {
        playPauseButtonOptions: {
          upFill: Constants.blueUpColor,
          overFill: Constants.blueOverColor,
          disabledFill: Constants.blueDisabledColor,
          downFill: Constants.blueDownColor,
          backgroundGradientColorStop0: Constants.buttonBorder0,
          backgroundGradientColorStop1: Constants.buttonBorder1,
          innerButtonLineWidth: 1,
          scaleFactorWhenNotPlaying: 1.25,
          touchAreaDilation: 12
        },

        stepForwardButtonOptions: {
          listener: model.manualStep.bind( model ),
          touchAreaDilation: 12,
          upFill: Constants.blueUpColor,
          overFill: Constants.blueOverColor,
          disabledFill: Constants.blueDisabledColor,
          downFill: Constants.blueDownColor,
          backgroundGradientColorStop0: Constants.buttonBorder0,
          backgroundGradientColorStop1: Constants.buttonBorder1
        }
      },

      scale: 0.75,
      centerX: Constants.VIEW_BOUNDS.width / 2,
      centerY: Constants.VIEW_BOUNDS.height - 131,

      tandem: tandem.createTandem( 'timeControlNode' )
    } ) );

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    resetAllButton.scale( 0.924 );
    this.addChild( resetAllButton );

    this.addChild( new AlignBox( new BottomControlPanel( model, tandem.createTandem( 'controlPanel' ) ), {
      alignBounds: new Bounds2( 0, 0, resetAllButton.left - 10, resetAllButton.bottom ),
      xAlign: 'right',
      yAlign: 'bottom'
    } ) );

    /*---------------------------------------------------------------------------*
     * StopwatchNode
     *----------------------------------------------------------------------------*/
    const stopwatchNode = new StopwatchNode( model.stopwatch, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: tandem.createTandem( 'stopwatchNode' )
    } );
    stopwatchNode.touchArea = stopwatchNode.localBounds.dilated( 5 );
    this.addChild( stopwatchNode );
    let windowImage;

    //center line
    this.addChild( new Line( 0, 0, 605, 0, {
      stroke: '#FFA91D',
      lineDash: [ 8, 5 ],
      lineWidth: 2,
      x: Constants.startStringNode,
      y: Constants.yStringNode,
      tandem: wavePlayAreaTandem.createTandem( 'centerLine' )
    } ) );
    const endNode = new EndNode( model, this.frameEmitter, {
      x: Constants.endStringNode,
      y: Constants.yStringNode,
      tandem: wavePlayAreaTandem.createTandem( 'endNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } );
    endNode.windowNode.x += Constants.endStringNode;
    endNode.windowNode.y += Constants.yStringNode;
    this.addChild( endNode.windowNode );
    this.addChild( new ReferenceLine( model, tandem.createTandem( 'referenceLineNode' ) ) );
    this.addChild( endNode );
    this.addChild( new StringNode( model, this.frameEmitter, {
      x: Constants.startStringNode,
      y: Constants.yStringNode,
      radius: Constants.segmentStringNodeRadius,
      tandem: wavePlayAreaTandem.createTandem( 'stringNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
    } ) );
    this.addChild( new StartNode( model, this.frameEmitter, {
      x: Constants.startStringNode,
      y: Constants.yStringNode,
      range: Constants.yWrenchRange,
      tandem: wavePlayAreaTandem.createTandem( 'startNode' ),
      visiblePropertyOptions: { phetioReadOnly: true }
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

waveOnAString.register( 'WOASScreenView', WOASScreenView );
export default WOASScreenView;