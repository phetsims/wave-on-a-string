/**
 * Copyright 2002-2013, University of Colorado
 * start object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var imageLoader = require( 'imageLoader' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function StartNode( x, y, model, options ) {

    Node.call( this, {x: x, y: y, scale: 1, renderer: 'svg', layerSplit: true } );
    var thisNode = this,
      key = new Node( {children: [new Image( imageLoader.getImage( 'wrench_2.png' ), {x: -40, y: -25, scale: 0.9} )], cursor: 'pointer'} ),
      wheel = new Node( {children: [new Image( imageLoader.getImage( 'oscillator_wheel.png' ), {x: -90 * 0.4, y: -90 * 0.4, scale: 0.4} )], y: 0} ),
      postShape = new Shape(),
      postGradient = new LinearGradient( -5, 0, 5, 0 )
        .addColorStop( 0, "#666" )
        .addColorStop( 0.3, "#FFF" )
        .addColorStop( 1, "#666" ),
      post = new Path( postShape, {
        stroke: "#000",
        fill: postGradient,
        lineWidth: 1
      } );


    this.addChild( key );
    this.addChild( post );
    this.addChild( new Node( {children: [wheel], y: 165} ) );

    var dx = 0.25 * key.width,
      dy = 0.25 * key.height,
      clickYOffset = 0;

    key.touchArea = Shape.rectangle( ( -key.width / 2 ) - dx, ( -key.height / 2 ) - dy, key.width + dx + dx, key.height + dy + dy );
    key.addInputListener( new SimpleDragHandler(
      {
        allowTouchSnag: true,
        start: function( event ) {
          clickYOffset = thisNode.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
        },
        drag: function( event ) {
          var y = thisNode.globalToParentPoint( event.pointer.point ).y - clickYOffset;
          y = Math.max( Math.min( y, options.max ), options.min );
          model.yNow[0] = y;
          model.play = true;
          model.yNowChanged = !model.yNowChanged;
        },
        translate: function() {
          // do nothing, override default behavior
        }
      } ) );


    model.yNowChangedProperty.link( function updateKey() {
      key.y = model.yNow[0] || 0;
      postShape = new Shape();
      postShape.moveTo( -5, key.y + 7 );
      postShape.lineTo( 5, key.y + 7 );
      postShape.lineTo( 5, 150 );
      postShape.lineTo( -5, 150 );
      postShape.close();
      post.shape = postShape;
    } );
    model.angleProperty.link( function updateWheel( value ) {
      wheel.matrix = new Matrix3();
      wheel.rotate( value );
    } );
    model.modeProperty.link( function updateVisible( value ) {
      key.setVisible( value === 'manual' );
      wheel.setVisible( value !== 'manual' );
      post.setVisible( value !== 'manual' );
    } );

  }

  inherit( Node, StartNode );

  return StartNode;
} );