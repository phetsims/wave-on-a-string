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
  var imageLoader = require( 'imageLoader' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function EndNode( x, y, model ) {

    Node.call( this, {x: x, y: y } );
    var clamp = new Node( {children: [new Image( imageLoader.getImage( 'clamp_2.png' ), {x: -18, y: -34, scale: 0.4} )]} ),
      ring_back = new Node( {children: [new Image( imageLoader.getImage( 'ring_back.png' ), {x: -15, y: -15 / 2, scale: 0.5} )], x: 20} ),
      ring_front = new Node( {children: [new Image( imageLoader.getImage( 'ring_front.png' ), {x: -15, y: 0, scale: 0.5} )], x: 20} ),
      window = new Node( {children: [new Image( imageLoader.getImage( 'window_back.png' ), {x: -101, y: -219 / 2, scale: 1} )], x: 20} ),
      postShape = new Shape(),
      postGradient = new LinearGradient( -5, 0, 5, 0 )
        .addColorStop( 0, "#666" )
        .addColorStop( 0.3, "#FFF" )
        .addColorStop( 1, "#666" );

    postShape.moveTo( -5, -130 );
    postShape.lineTo( 5, -130 );
    postShape.lineTo( 5, 130 );
    postShape.lineTo( -5, 130 );
    postShape.close();

    var post = new Path( {
      shape: postShape,
      stroke: "#000",
      fill: postGradient,
      lineWidth: 1,
      x: 20
    } );

    this.addChild( clamp );
    this.addChild( ring_back );
    this.addChild( post );
    this.addChild( ring_front );
    this.addChild( window );

    model.yNowChangedProperty.link( function updateKey() {
      ring_front.y = ring_back.y = model.yNow[model.yNow.length - 1] || 0;
    } );

    model.typeEndProperty.link( function updateVisible( value ) {
      clamp.setVisible( value === 'fixedEnd' );
      ring_back.setVisible( value === 'looseEnd' );
      post.setVisible( value === 'looseEnd' );
      ring_front.setVisible( value === 'looseEnd' );
      window.setVisible( value === 'noEnd' );
    } );

  }

  inherit( Node, EndNode );

  return EndNode;
} );