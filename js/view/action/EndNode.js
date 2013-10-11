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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function EndNode( x, y, model ) {
    //REVIEW: x: 20 seems to be duplicated in this file, should be generally separated out as a constant

    Node.call( this, {x: x, y: y } );
    /*REVIEW:
     * I'm not sure why wrapping some of these in an extra Node is necessary. Scenery's Image is a subtype of Node,
     * so for the clamp, it can be replaced with:
     * var clamp = new Image( require( 'image!WOAS/clamp_2.png' ), {x: -18, y: -34, scale: 0.4} )
     *
     * The x values can be combined, so for the window:
     * rwindow = new Image( require( 'image!WOAS/window_back.png' ), {x: -81, y: -219 / 2, scale: 1} )
     *
     * I see how ring_back and ring_front have y values modified later, so keeping them wrapped with the Node is helpful
     */
    var clamp = new Node( {children: [new Image( require( 'image!WOAS/clamp_2.png' ), {x: -18, y: -34, scale: 0.4} )]} ),
      ring_back = new Node( {children: [new Image( require( 'image!WOAS/ring_back.png' ), {x: -15, y: -15 / 2, scale: 0.5} )], x: 20} ),
      ring_front = new Node( {children: [new Image( require( 'image!WOAS/ring_front.png' ), {x: -15, y: 0, scale: 0.5} )], x: 20} ),
      window = new Node( {children: [new Image( require( 'image!WOAS/window_back.png' ), {x: -101, y: -219 / 2, scale: 1} )], x: 20} ),
      postShape = new Shape(),
      postGradient = new LinearGradient( -5, 0, 5, 0 )
        .addColorStop( 0, "#666" )
        .addColorStop( 0.3, "#FFF" )
        .addColorStop( 1, "#666" );

    /*REVIEW:
     * For rectangular shapes, please use SCENERY/nodes/Rectangle.
     *
     * In this instance:
     * var post = new Rectangle( -5, -130, 10, 260, {
     *   stroke: '#000',
     *   fill: new LinearGradient( -5, 0, 5, 0 )
     *              .addColorStop( 0, "#666" )
     *              .addColorStop( 0.3, "#FFF" )
     *              .addColorStop( 1, "#666" ),
     *   x: 20
     * } );
     *
     * Also note that lineWidth: 1 is the default, and when specified does nothing
     *
     * It's generally easier and more concise, and it will be faster both to create and to render, since
     * it uses more accelerated graphics for Canvas and SVG
     */
    postShape.moveTo( -5, -130 );
    postShape.lineTo( 5, -130 );
    postShape.lineTo( 5, 130 );
    postShape.lineTo( -5, 130 );
    postShape.close();

    var post = new Path( postShape, {
      stroke: "#000",
      fill: postGradient,
      lineWidth: 1, //REVIEW: 1 is the default, this line is unnecessary
      x: 20
    } );

    this.addChild( clamp );
    this.addChild( ring_back );
    this.addChild( post );
    this.addChild( ring_front );
    this.addChild( window );

    //REVIEW: please replace with model.on( 'yNowChanged', function updateKey() { ... } ) as suggested in WOASModel.js review notes
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
