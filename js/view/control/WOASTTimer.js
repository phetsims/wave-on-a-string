/**
 * Copyright 2002-2013, University of Colorado
 * Timer Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllShape = require( 'SCENERY_PHET/ResetAllShape' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  function timeToString( timeInSeconds ) {
    var minutes = Math.floor( timeInSeconds / 60 ) % 60;
    var seconds = Math.floor( timeInSeconds ) % 60;
    var centiseconds = Math.floor( timeInSeconds % 1 * 100 );
    if ( centiseconds < 10 ) {
      centiseconds = '0' + centiseconds;
    }
    if ( seconds < 10 ) {
      seconds = '0' + seconds;
    }
    if ( minutes < 10 ) {
      minutes = '0' + minutes;
    }
    return minutes + ':' + seconds + ':' + centiseconds;
  }

  function WOASTTimer( model, options ) {
    Node.call( this, _.extend( { cursor: 'pointer' }, options ) );
    var thisNode = this;

    var iconColor = '#333';
    var buttonBaseColor = '#DFE0E1';

    var resetAllShape = new ResetAllShape( 10 );
    var playPauseHeight = resetAllShape.computeBounds().height;
    var playPauseWidth = 0.8 * playPauseHeight;
    var playShape = new Shape().moveTo( playPauseWidth, 0 ).lineTo( 0, playPauseHeight / 2 ).lineTo( 0, -playPauseHeight / 2 ).close();
    var pauseShape = new Shape().rect( 0, -playPauseHeight / 2, playPauseWidth / 3, playPauseHeight ).rect( playPauseWidth * 2 / 3, -playPauseHeight / 2, playPauseWidth / 3, playPauseHeight );

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


    var playPauseButton = new BooleanRectangularToggleButton( new Path( pauseShape, { fill: iconColor } ), new Path( playShape, { fill: iconColor } ), model.timerStartProperty, {
      baseColor: buttonBaseColor
    } );

    var readoutText = new Text( timeToString( 0 ), {
      font: new PhetFont( 20 ),
      top: 0,
      centerX: 0
    } );

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

    var panelPad = 5;
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
    var baseColor = new Color( 190, 240, 255 );
    var lightColor = baseColor.colorUtilsBrighter( 0.5 );
    var darkColor = baseColor.colorUtilsDarker( 0.2 );

    panelBackground.fill = new LinearGradient( panelBackground.left, 0, panelBackground.width, 0 )
      .addColorStop( 0, lightColor )
      .addColorStop( 0.07, baseColor )
      .addColorStop( 0.95, baseColor )
      .addColorStop( 1, darkColor );

    panelEffect.fill = new LinearGradient( 0, panelEffect.top, 0, panelEffect.bottom )
      .addColorStop( 0, lightColor )
      .addColorStop( 0.07, lightColor.withAlpha( 0 ) )
      .addColorStop( 0.95, darkColor.withAlpha( 0 ) )
      .addColorStop( 1, darkColor );
    panelEffect.stroke = 'rgba(0,0,0,0.4)';

    panelEffect.touchArea = panelEffect.localBounds.dilated( 10 );

    this.addChild( panelBackground );
    this.addChild( panelEffect );

    var dragZone = Rectangle.bounds( panelBackground.bounds, {} );

    this.addChild( dragZone );
    this.addChild( timer );

    model.timerProperty.link( function updateVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.timerSecondProperty.link( function updateTime( value ) {
      readoutText.text = timeToString( value );
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

  inherit( Node, WOASTTimer );
  return WOASTTimer;
} );
