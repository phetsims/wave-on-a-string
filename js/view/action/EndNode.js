/**
 * Copyright 2002-2013, University of Colorado
 * end object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Constants = require( 'WOAS/Constants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function EndNode( model, events, options ) {
    Node.call( this );
    var clamp = new Image( require( 'image!WOAS/clamp_2.png' ), {x: -18, y: -34, scale: 0.4} ),
      ring_back = new Node( {children: [new Image( require( 'image!WOAS/ring_back.png' ), {x: 5, y: -14 / 2, scale: 0.5} )]} ),
      ring_front = new Node( {children: [new Image( require( 'image!WOAS/ring_front.png' ), {x: 4.7, y: 0, scale: 0.5} )]} ),
      windowImage = new Image( require( 'image!WOAS/window_back.png' ), {x: -81, y: -219 / 2} ),
      post = new Rectangle( -5, -130, 10, 260, {
        stroke: '#000',
        fill: Constants.postGradient,
        x: 20
      } );

    this.addChild( clamp );
    this.addChild( ring_back );
    this.addChild( post );
    this.addChild( ring_front );
    // this.addChild( windowImage );
    this.windowImage = windowImage;

    this.mutate( options );

    function updateKey() {
      ring_front.y = ring_back.y = model.yNow[model.yNow.length - 1] || 0;
    }

    var dirty = true;
    model.on( 'yNowChanged', function() { dirty = true; } );
    events.on( 'frame', function() {
      if ( dirty ) {
        updateKey();
        dirty = false;
      }
    } );

    model.typeEndProperty.link( function updateVisible( value ) {
      clamp.setVisible( value === 'fixedEnd' );
      ring_back.setVisible( value === 'looseEnd' );
      post.setVisible( value === 'looseEnd' );
      ring_front.setVisible( value === 'looseEnd' );
      windowImage.setVisible( value === 'noEnd' );
    } );

  }

  inherit( Node, EndNode );

  return EndNode;
} );
