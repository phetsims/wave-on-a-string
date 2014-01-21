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
  var Image = require( 'SCENERY/nodes/Image' );
  var Shape = require( 'KITE/Shape' );
  var Constants = require( 'WOAS/Constants' );
  var Vector2 = require( 'DOT/Vector2' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function StartNode( model, events, options ) {
    options = _.extend( { layerSplit: true }, options );
    
    var postNodeHeight = 158;
    var postScale = 3;

    Node.call( this );
    var thisNode = this,
      wheelImg,
      key = new Node( {children: [new Image( require( 'image!WOAS/wrench_2.svg' ), {x: -40, y: -25, scale: 0.9, pickable: false} )], cursor: 'pointer'} ),
      wheel = new Node( {children: [wheelImg = new Image( require( 'image!WOAS/oscillator_wheel.png' ), {scale: 0.4} )]} ),
      post = new Rectangle( Constants.offsetWheel.x - 5, 0, 10, postNodeHeight, {
        stroke: '#000',
        fill: Constants.postGradient
      } );
    
    // cache the post as an image, since otherwise with the current Scenery its gradient is updated every frame in the defs (NOTE: remove this with Scenery 0.2?)
    var postCache = new Node( { scale: 1/postScale } );
    new Node( { children: [post], scale: postScale } ).toImageNodeAsynchronous( function( image ) {
      postCache.addChild( image );
    } );
    post = new Node( { children: [postCache] } );
    
    wheelImg.center = new Vector2();
    thisNode.addChild( key );
    thisNode.addChild( post );
    thisNode.addChild( new Node( {children: [wheel], translation: Constants.offsetWheel} ) );

    key.touchArea = Shape.bounds( key.bounds.dilated( Constants.dilatedTouchArea ) );
    key.mouseArea = Shape.bounds( key.bounds );

    key.addInputListener( Constants.dragAndDropHandler( key, function( point ) {
      model.yNow[0] = Math.max( Math.min( point.y, options.range.max ), options.range.min );
      model.play = true;
      model.trigger( 'yNowChanged' );
    } ) );

    thisNode.mutate( options );
    function updateKey() {
      if ( key.isVisible() ) {
        key.y = model.yNow[0];
      }
    }
    function updatePost() {
      var y = model.yNow[0];
      if ( post.isVisible() ) {
        // TODO: reduce garbage allocation here
        post.setMatrix( new Matrix3( 1, 0,                                                      0,
                                     0, ( Constants.offsetWheel.y - (y + 7) ) / postNodeHeight, y + 7,
                                     0, 0,                                                      1 ) );
      }
    }
    
    var dirty = true;
    model.on( 'yNowChanged', function() { dirty = true; } );
    events.on( 'frame', function() {
      if ( dirty ) {
        updateKey();
        updatePost();
        dirty = false;
      }
    } );
    
    model.angleProperty.link( function updateWheel( value ) {
      // wheel.rotation = value;
      wheel.setMatrix( Matrix3.rotation2( value ) ); // doesn't need to compute current transform, or do matrix multiplication
    } );
    model.modeProperty.link( function updateVisible( value ) {
      var keyIsVisible = value === 'manual';
      if ( key.isVisible() !== keyIsVisible ) {
        key.setVisible( keyIsVisible );
        
        updateKey();
      }
      
      if ( post.isVisible() === keyIsVisible ) {
        wheel.setVisible( !keyIsVisible );
        post.setVisible( !keyIsVisible );
        
        updatePost();
      }
    } );
  }

  inherit( Node, StartNode );
  return StartNode;
} );
