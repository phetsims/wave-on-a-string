/**
 * Copyright 2002-2013, University of Colorado
 * Timer Node.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PushButton = require( 'SUN/PushButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ToggleButton = require( 'SUN/ToggleButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var resetTimerString = require( 'string!WOAS/resetTimer' );

  function WOASTTimer( model ) {
    Node.call( this, { cursor: "pointer" } );
    var thisNode = this,
      timer = new Node(),
      textTimer;

    var resetTimer = function() {
      model.timerStart = false;
      model.timerSecond = 0;
    };
    var secondToString = function( second ) {
      var _minutes = (Math.floor( second / 60 ) % 60),
        _seconds = (Math.floor( second ) % 60),
        _milliseconds = Math.floor( second % 1 * 100 );
      if ( _milliseconds < 10 ) {
        _milliseconds = "0" + _milliseconds;
      }
      if ( _seconds < 10 ) {
        _seconds = "0" + _seconds;
      }
      if ( _minutes < 10 ) {
        _minutes = "0" + _minutes;
      }
      return   _minutes + ":" + _seconds + ":" + _milliseconds;
    };
    var label = new Text( resetTimerString, {font: new PhetFont( 17 ), centerX: 40, centerY: 20} );

    timer.addChild( new PushButton(
      new Node( {children: [new Image( require( 'image!WOAS/button_timer_reset_unpressed.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/button_timer_reset_hover.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/button_timer_reset_pressed.png' ) ), label]} ),
      new Node( {children: [new Image( require( 'image!WOAS/button_timer_reset_unpressed.png' ) ), label]} ),
      {scale: 0.7, y: 30, x: 3, listener: resetTimer} ) );

    timer.addChild( new ToggleButton(
      new Image( require( 'image!WOAS/button_timer_pause_unpressed.png' ) ),
      new Image( require( 'image!WOAS/button_timer_start_unpressed.png' ) ),
      model.timerStartProperty,
      {scale: 0.7, y: 26, x: 64} ) );

    timer.addChild( new Rectangle( 0, 0, 100, 24, 5, 5, {fill: '#FFF', stroke: '#000', lineWidth: 1} ) );
    timer.addChild( textTimer = new Text( "00:00:00", {font: new PhetFont( 20 ), centerX: 50, top: 0} ) );
    this.addChild( new Panel( timer, { fill: '#FFFF06', stroke: '#F7941E', lineWidth: 2, xMargin: 10, yMargin: 5} ) );

    model.timerProperty.link( function updateVisible( value ) {
      thisNode.setVisible( value );
    } );
    model.timerSecondProperty.link( function updateTime( value ) {
      textTimer.text = secondToString( value );
    } );
    model.timerLocProperty.link( function updateLocation( value ) {
      //REVIEW: once using Vector2, this will be "thisNode.translation = value"
      thisNode.x = value.x;
      thisNode.y = value.y;
    } );
    //REVIEW: Use Vector2 for 2d numeric data
    var clickOffset = {x: 0, y: 0};
    //REVIEW: a lot of this code is duplicated between WOASTLine / WOASTRulers / WOASTTimer. reduce duplication?
    thisNode.addInputListener( new SimpleDragHandler(
      {
        start: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          clickOffset.x = thisNode.globalToParentPoint( event.pointer.point ).x - event.currentTarget.x;
          clickOffset.y = thisNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          //REVIEW: see comments in WOASTLine.js
          var x = thisNode.globalToParentPoint( event.pointer.point ).x - clickOffset.x,
            y = thisNode.globalToParentPoint( event.pointer.point ).y - clickOffset.y;
          model.timerLoc = { x: x, y: y };
        }
      } ) );
  }

  inherit( Node, WOASTTimer );
  return WOASTTimer;
} );
