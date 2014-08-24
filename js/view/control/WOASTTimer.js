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
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
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

  function WOASTTimer( model ) {
    Node.call( this, { cursor: 'pointer' } );
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
      stroke: '#333'
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

    var timerPanel = new Panel( timer, {
      fill: '#FFFF06',
      stroke: '#F7941E',
      lineWidth: 1,
      xMargin: 5,
      yMargin: 5
    } );
    var dragZone = Rectangle.bounds( timerPanel.bounds, {} );

    this.addChild( dragZone );
    this.addChild( timerPanel );

    model.timerProperty.link( function updateVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.timerSecondProperty.link( function updateTime( value ) {
      readoutText.text = timeToString( value );
    } );
    model.timerLocProperty.link( function updateLocation( value ) {
      thisNode.translation = value;
    } );
    dragZone.touchArea = dragZone.localBounds.dilated( 10 );
    var clickOffset = new Vector2();
    dragZone.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          clickOffset = dragZone.globalToParentPoint( event.pointer.point ).minus( event.currentTarget.translation );
        },
        drag: function( event ) {
          model.timerLoc = thisNode.globalToParentPoint( event.pointer.point ).minus( clickOffset );
        }
      } ) );
  }

  inherit( Node, WOASTTimer );
  return WOASTTimer;
} );
