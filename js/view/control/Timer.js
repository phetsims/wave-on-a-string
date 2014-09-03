/**
 * Copyright 2002-2013, University of Colorado
 * Timer Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  // var LineStyles = require( 'KITE/util/LineStyles' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Pseudo3DRoundedRectangle = require( 'WOAS/view/control/Pseudo3DRoundedRectangle' );

  function timeToBigString( timeInSeconds ) {
    var minutes = Math.floor( timeInSeconds / 60 ) % 60;
    var seconds = Math.floor( timeInSeconds ) % 60;
    if ( seconds < 10 ) {
      seconds = '0' + seconds;
    }
    if ( minutes < 10 ) {
      minutes = '0' + minutes;
    }
    return minutes + ':' + seconds;
  }

  function timeToSmallString( timeInSeconds ) {
    var centiseconds = Math.floor( timeInSeconds % 1 * 100 );
    if ( centiseconds < 10 ) {
      centiseconds = '0' + centiseconds;
    }
    return '.' + centiseconds;
  }

  function Timer( model, options ) {
    Node.call( this, _.extend( { cursor: 'pointer' }, options ) );
    var thisNode = this;

    var iconColor = '#333';
    var buttonBaseColor = '#DFE0E1';

    var paddingBetweenItems = 6;

    var resetAllShape = new UTurnArrowShape( 10 );
    var playPauseHeight = resetAllShape.computeBounds().height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
    var playOffset = 0.15 * playPauseWidth;
    // var playArrowX = 0.5 * playPauseWidth;
    // var playShape = new Shape().moveTo( halfPlayStroke, 0 )
    //                            .lineTo( playPauseWidth - halfPlayStroke, 0 )
    //                            .moveTo( playArrowX, -playPauseHeight / 2 + halfPlayStroke )
    //                            .lineTo( playPauseWidth - halfPlayStroke, 0 )
    //                            .lineTo( playArrowX, playPauseHeight / 2 - halfPlayStroke ).getStrokedShape( new LineStyles( {
    //                              lineWidth: halfPlayStroke * 2,
    //                              lineCap: 'round',
    //                              lineJoin: 'round'
    //                            } ) );
    // var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5, 0 )
    //                            .lineTo( halfPlayStroke * 1.5, playPauseHeight / 2 - halfPlayStroke )
    //                            .lineTo( halfPlayStroke * 1.5, -playPauseHeight / 2 + halfPlayStroke )
    //                            .close();
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5 - playOffset, 0 )
                               .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseHeight / 2 - halfPlayStroke - playOffset )
                               .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseHeight / 2 + halfPlayStroke + playOffset )
                               .close().getOffsetShape( -playOffset );
    // a stop symbol (square)
    var pauseShape = Shape.bounds( new Bounds2( 0, -playPauseHeight / 2, playPauseWidth, playPauseHeight / 2 ).eroded( playPauseWidth * 0.1 ) );

    var bigReadoutText = new Text( timeToBigString( 0 ), {
      font: new PhetFont( 20 )
    } );
    var smallReadoutText = new Text( timeToSmallString( 0 ), {
      font: new PhetFont( 15 ),
      left: bigReadoutText.right
    } );
    // aligns the baselines of the big and small text
    smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
    bigReadoutText.top = 0;
    var readoutText = new Node( {
      children: [
        bigReadoutText,
        smallReadoutText
      ]
    } );
    readoutText.centerX = 0;

    var textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 5, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)'
    } );
    var minimumButtonWidth = ( textBackground.width - paddingBetweenItems ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

    var resetButton = new RectangularPushButton( {
      listener: function resetTimer() {
        model.timerStart = false;
        model.timerSecond = 0;
      },
      content: new Path( resetAllShape, {
        fill: iconColor
      } ),
      baseColor: buttonBaseColor,
      minWidth: minimumButtonWidth
    } );

    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( pauseShape, { fill: iconColor } ),
      new Path( playShape, { stroke: iconColor, fill: '#eef', lineWidth: halfPlayStroke * 2 } ), model.timerStartProperty, {
        baseColor: buttonBaseColor,
        minWidth: minimumButtonWidth
    } );

    var timer = new Node();
    timer.addChild( resetButton );
    timer.addChild( playPauseButton );
    timer.addChild( textBackground );
    timer.addChild( readoutText );

    // layout
    resetButton.right = -paddingBetweenItems / 2;
    playPauseButton.left = paddingBetweenItems / 2;
    resetButton.top = textBackground.bottom + paddingBetweenItems;
    playPauseButton.top = textBackground.bottom + paddingBetweenItems;

    var panelPad = 8;
    timer.left = panelPad;
    timer.top = panelPad;

    var roundedRectangle = new Pseudo3DRoundedRectangle( timer.bounds.dilated( panelPad ), {
      baseColor: new Color( 80, 130, 230 ),
      cornerRadius: 10
    } );

    roundedRectangle.touchArea = roundedRectangle.localBounds.dilated( 10 );

    this.addChild( roundedRectangle );

    var dragZone = Rectangle.bounds( roundedRectangle.bounds, {} );

    this.addChild( dragZone );
    this.addChild( timer );

    model.timerProperty.link( function updateVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.timerSecondProperty.link( function updateTime( value ) {
      bigReadoutText.text = timeToBigString( value );
      smallReadoutText.text = timeToSmallString( value );
      resetButton.enabled = value > 0;
    } );
    model.timerLocProperty.link( function updateLocation( value ) {
      thisNode.translation = value;
    } );
    var clickOffset = new Vector2();
    roundedRectangle.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          clickOffset = roundedRectangle.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
        },
        drag: function( event ) {
          model.timerLoc = thisNode.globalToParentPoint( event.pointer.point ).minus( clickOffset );
        }
      } ) );
  }

  inherit( Node, Timer );
  return Timer;
} );
