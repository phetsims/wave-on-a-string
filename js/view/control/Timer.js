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
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );

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

    var resetAllShape = new UTurnArrowShape( 10 );
    var playPauseHeight = resetAllShape.computeBounds().height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
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
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5, 0 )
                               .lineTo( halfPlayStroke * 1.5, playPauseHeight / 2 - halfPlayStroke )
                               .lineTo( halfPlayStroke * 1.5, -playPauseHeight / 2 + halfPlayStroke )
                               .close();
    // a stop symbol (square)
    var pauseShape = Shape.bounds( new Bounds2( 0, -playPauseHeight / 2, playPauseWidth, playPauseHeight / 2 ).eroded( playPauseWidth * 0.1 ) );

    var resetButton = new RectangularPushButton( {
      listener: function resetTimer() {
        model.timerStart = false;
        model.timerSecond = 0;
      },
      content: new Path( resetAllShape, {
        fill: iconColor
      } ),
      baseColor: buttonBaseColor
    } );


    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( pauseShape, { fill: iconColor } ),
      new Path( playShape, { stroke: iconColor, fill: '#5a5', lineWidth: halfPlayStroke * 2, lineCap: 'round', lineJoin: 'round' } ), model.timerStartProperty, {
        baseColor: buttonBaseColor
    } );

    var bigReadoutText = new Text( timeToBigString( 0 ), {
      font: new PhetFont( 20 ),
      top: 0
    } );
    var smallReadoutText = new Text( timeToSmallString( 0 ), {
      font: new PhetFont( 16 ),
      left: bigReadoutText.right,
      bottom: bigReadoutText.bottom
    } );
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

    var timer = new Node();
    timer.addChild( resetButton );
    timer.addChild( playPauseButton );
    timer.addChild( textBackground );
    timer.addChild( readoutText );

    // layout
    resetButton.right = -5;
    playPauseButton.left = 5;
    resetButton.top = textBackground.bottom + 5;
    playPauseButton.top = textBackground.bottom + 5;

    var panelPad = 8;
    var panelRound = 10;
    timer.left = panelPad;
    timer.top = panelPad;

    var panelBackground = Rectangle.roundedBounds( timer.bounds.dilated( panelPad ), panelRound, panelRound, {} );

    // adds the extra 3D effect, and is draggable
    var panelEffect = Rectangle.roundedBounds( timer.bounds.dilated( panelPad ), panelRound, panelRound, {} );

    // other possible colors to demo
    // var baseColor = new Color( 255, 220, 150 );
    // var baseColor = new Color( 150, 220, 255 );
    // var baseColor = new Color( 170, 230, 255 );
    // var baseColor = new Color( 190, 240, 255 );
    // var baseColor = new Color( 50, 80, 230 );
    var baseColor = new Color( 80, 130, 230 );
    var lighterColor = baseColor.colorUtilsBrighter( 0.6 );
    var lightColor = baseColor.colorUtilsBrighter( 0.5 );
    var darkColor = baseColor.colorUtilsDarker( 0.5 );
    var darkerColor = baseColor.colorUtilsDarker( 0.6 );

    var lightOffset = 0.07 * panelEffect.height;
    var darkOffset = 0.05 * panelEffect.height;

    panelBackground.fill = new LinearGradient( panelBackground.left, 0, panelBackground.width, 0 )
      .addColorStop( 0, lightColor )
      .addColorStop( lightOffset / panelEffect.width, baseColor )
      .addColorStop( 1 - darkOffset / panelEffect.width, baseColor )
      .addColorStop( 1, darkColor );

    panelEffect.fill = new LinearGradient( 0, panelEffect.top, 0, panelEffect.bottom )
      .addColorStop( 0, lighterColor )
      .addColorStop( lightOffset / panelEffect.height, lighterColor.withAlpha( 0 ) )
      .addColorStop( 1 - darkOffset / panelEffect.height, darkerColor.withAlpha( 0 ) )
      .addColorStop( 1, darkerColor );

    panelEffect.touchArea = panelEffect.localBounds.dilated( 10 );

    var lightCorner = new Path( new Shape().moveTo( 0, 0 )
                                           .arc( 0, 0, panelRound, -Math.PI, -Math.PI / 2, false )
                                           .close(), {
      x: panelEffect.left + panelRound,
      y: panelEffect.top + panelRound,
      fill: new RadialGradient( 0, 0, 0, 0, 0, panelRound ).addColorStop( 0, baseColor )
                                                           .addColorStop( 1 - lightOffset / panelRound, baseColor )
                                                           .addColorStop( 1, lighterColor )
    } );

    var darkCorner = new Path( new Shape().moveTo( 0, 0 )
                                          .arc( 0, 0, panelRound, 0, Math.PI / 2, false )
                                          .close(), {
      x: panelEffect.right - panelRound,
      y: panelEffect.bottom - panelRound,
      fill: new RadialGradient( 0, 0, 0, 0, 0, panelRound ).addColorStop( 0, baseColor )
                                                           .addColorStop( 1 - darkOffset / panelRound, baseColor )
                                                           .addColorStop( 1, darkerColor )
    } );

    // the stroke around the outside
    var panelStroke = Rectangle.roundedBounds( timer.bounds.dilated( panelPad ), panelRound, panelRound, {
      stroke: darkColor.withAlpha( 0.4 )
    } );

    this.addChild( panelBackground );
    this.addChild( panelEffect );
    this.addChild( lightCorner );
    this.addChild( darkCorner );
    this.addChild( panelStroke );

    var dragZone = Rectangle.bounds( panelBackground.bounds, {} );

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
    panelEffect.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          clickOffset = panelEffect.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
        },
        drag: function( event ) {
          model.timerLoc = thisNode.globalToParentPoint( event.pointer.point ).minus( clickOffset );
        }
      } ) );
  }

  inherit( Node, Timer );
  return Timer;
} );
