/**
 * Copyright 2002-2013, University of Colorado
 * start object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Constants = require( 'WOAS/Constants' );
  var Pseudo3DRoundedRectangle = require( 'WOAS/view/control/Pseudo3DRoundedRectangle' );
  var PulseButton = require( 'WOAS/view/control/PulseButton' );

  var wrenchImage = require( 'image!WOAS/wrench.svg' );
  wrenchImage.width = 60;
  wrenchImage.height = 209;

  function StartNode( model, events, options ) {
    options = _.extend( { layerSplit: true }, options );

    var postNodeHeight = 158;
    var postScale = 3;

    Node.call( this );
    var thisNode = this;

    var wheelRadius = 29.5;
    var wheel = new Circle( wheelRadius, {
      stroke: '#333',
      lineWidth: 1.5,
      fill: new LinearGradient( -wheelRadius, 0, wheelRadius, 0 ).addColorStop( 0, 'rgb(200,186,186)' ).addColorStop( 1, 'rgb(230,230,230)' )
    } );

    var innerWheelRadius = 4.8;
    wheel.addChild( new Circle( innerWheelRadius, {
      stroke: '#333',
      lineWidth: 1.5,
      fill: '#fff'
    } ) );
    wheel.addChild( new Line( -innerWheelRadius, 0, innerWheelRadius, 0, { stroke: '#333', lineWidth: 1.5 } ) );
    wheel.addChild( new Circle( innerWheelRadius, {
      x: innerWheelRadius * 1.5 - wheelRadius,
      stroke: '#333',
      lineWidth: 0.5,
      fill: new RadialGradient( 0, 0, 0, 0, 0, innerWheelRadius ).addColorStop( 0.2, '#eee' ).addColorStop( 1, 'rgb(110,50,25)' )
    } ) );

    // var wheelImageScale = 3;
    // wheel.scale( wheelImageScale );
    // wheel = wheel.toDataURLNodeSynchronous();

    var wrench = new Node( {children: [new Image( wrenchImage, {x: -40, y: -24, scale: 0.9, pickable: false} )], cursor: 'pointer'} );
    var post = new Rectangle( Constants.offsetWheel.x - 5, 0, 10, postNodeHeight, {
      stroke: '#000',
      fill: Constants.postGradient
    } );

    var pistonBox = new Pseudo3DRoundedRectangle( Bounds2.point( Constants.offsetWheel.x, Constants.offsetWheel.y ).dilatedXY( 40, 25 ), {
      baseColor: new Color( 200, 200, 200 ),
      lightFactor: 0.5,
      lighterFactor: 0.1,
      darkFactor: 0.5,
      darkerFactor: 0.1,
      cornerRadius: 6
    } );

    pistonBox.addChild( new PulseButton( model, { center: pistonBox.center } ) );

    // cache the post as an image, since otherwise with the current Scenery its gradient is updated every frame in the defs (NOTE: remove this with Scenery 0.2?)
    var postCache = new Node( { scale: 1 / postScale } );
    new Node( { children: [post], scale: postScale } ).toImageNodeAsynchronous( function( image ) {
      postCache.addChild( image );
    } );
    post = new Node( { children: [postCache] } );

    thisNode.addChild( wrench );
    thisNode.addChild( post );
    thisNode.addChild( new Node( {children: [wheel], translation: Constants.offsetWheel} ) );
    thisNode.addChild( pistonBox );

    wrench.touchArea = Shape.bounds( wrench.bounds.dilated( Constants.dilatedTouchArea ) );
    wrench.mouseArea = Shape.bounds( wrench.bounds );

    wrench.addInputListener( Constants.dragAndDropHandler( wrench, function( point ) {
      model.nextLeftY = Math.max( Math.min( point.y, options.range.max ), options.range.min );
      model.play = true;
      model.trigger( 'yNowChanged' );
    } ) );

    thisNode.mutate( options );
    function updateKey() {
      if ( wrench.isVisible() ) {
        wrench.y = model.yNow[0];
      }
    }

    function updatePost() {
      var y = model.yNow[0];
      if ( post.isVisible() ) {
        // TODO: reduce garbage allocation here
        post.setMatrix( Matrix3.createFromPool( 1, 0, 0,
          0, ( Constants.offsetWheel.y - (y + 7) ) / postNodeHeight, y + 7,
          0, 0, 1 ) );
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

    // workaround for image not being perfectly centered
    // wheel.addChild( new Circle( 29.4, { stroke: '#333', lineWidth: 1.4 } ) );

    // var wheelScaleMatrix = Matrix3.scale( 1 / wheelImageScale );
    model.angleProperty.link( function updateWheel( value ) {
      // wheel.rotation = value;
      wheel.setMatrix( Matrix3.rotation2( value ) ); // doesn't need to compute current transform, or do matrix multiplication
      // wheel.setMatrix( Matrix3.rotation2( value ).timesMatrix( wheelScaleMatrix ) ); // doesn't need to compute current transform, or do matrix multiplication
    } );
    model.modeProperty.link( function updateVisible( value ) {
      var wrenchIsVisible = value === 'manual';
      if ( wrench.isVisible() !== wrenchIsVisible ) {
        wrench.setVisible( wrenchIsVisible );

        updateKey();
      }

      var postIsVisible = value !== 'manual';
      if ( post.isVisible() !== postIsVisible ) {
        post.setVisible( postIsVisible );

        updatePost();
      }

      wheel.setVisible( value === 'oscillate' );
      pistonBox.setVisible( value === 'pulse' );
    } );
  }

  inherit( Node, StartNode );
  return StartNode;
} );
