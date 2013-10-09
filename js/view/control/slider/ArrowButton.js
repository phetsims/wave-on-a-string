/**
 * Copyright 2002-2013, University of Colorado
 * Button with an arrow that points left or right.
 *
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButton = require( 'SUN/PushButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  /**
   * @param {String} direction 'left' or 'right'
   * @param callback
   * @param options
   * @constructor
   */
  function ArrowButton( direction, callback, options ) {

    var button = new PushButton(
      new Node( {children: [new Image( require( 'image!WOAS/tweaker_right_unpressed.png' ) )]} ),
      new Node( {children: [new Image( require( 'image!WOAS/tweaker_right_hover.png' ) )]} ),
      new Node( {children: [new Image( require( 'image!WOAS/tweaker_right_pressed.png' ) )]} ),
      new Node( {children: [new Image( require( 'image!WOAS/tweaker_right_disabled.png' ) )]} ),
      callback, {scale: 1.3, centerX: 0, centerY: 0} );
    if ( direction === 'left' ) {
      button.scale( -1, 1 );
    }
    options = _.extend( {children: [button]}, options );
    Node.call( this, options );

    this.setEnabled = function( value ) {
      button.enabled = value;
    };
  }

  inherit( Node, ArrowButton );

  return ArrowButton;
} );