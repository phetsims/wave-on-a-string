// Copyright 2013-2015, University of Colorado Boulder

/**
 * start object view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );
  var platform = require( 'PHET_CORE/platform' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Constants = require( 'WAVE_ON_A_STRING/wave-on-a-string/Constants' );
  var PulseButton = require( 'WAVE_ON_A_STRING/wave-on-a-string/view/control/PulseButton' );
  var Image = require( 'SCENERY/nodes/Image' );

  var wrenchImage = require( 'image!WAVE_ON_A_STRING/wrench.png' );

  function StartNode( model, frame, options ) {
    options = _.extend( { layerSplit: true }, options );

    var postNodeHeight = 158;
    var postScale = 3;

    Node.call( this );
    var self = this;

    /*---------------------------------------------------------------------------*
     * Oscillation wheel
     *----------------------------------------------------------------------------*/
    var wheelRadius = 29.5;
    var wheel = new Circle( wheelRadius, {
      stroke: '#333',
      lineWidth: 1.5,
      fill: new LinearGradient( -wheelRadius, 0, wheelRadius, 0 ).addColorStop( 0, 'rgb(215,210,210)' ).addColorStop( 1, 'rgb(215,210,210)' )
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
      fill: new RadialGradient( 0, 0, 0, 0, 0, innerWheelRadius ).addColorStop( 0.2, '#555' ).addColorStop( 1, '#555' )
    } ) );

    // toImage* style conversion of the wheel if necessary for performance
    var wheelImageScale = 3;
    wheel.scale( wheelImageScale );
    var wheelSize = Math.ceil( wheel.width / 2 ) + 2;
    wheel = wheel.toDataURLNodeSynchronous( wheelSize, wheelSize, 2 * wheelSize, 2 * wheelSize );
    if ( platform.firefox ) {
      wheel.renderer = 'canvas';
    }

    /*---------------------------------------------------------------------------*
     * Wrench
     *----------------------------------------------------------------------------*/
    var wrenchImageNode = new Image( wrenchImage, { x: -40, y: -24, scale: 0.9 / 4, pickable: false } );
    var wrenchArrowOptions = {
      fill: 'hsl(210,90%,60%)',
      tailWidth: 10,
      headWidth: 22,
      headHeight: 18
    };
    var wrenchArrowXOffset = 8;
    var wrenchArrowYOffset = 10;
    var wrenchTopArrow = new ArrowNode( wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.top - wrenchArrowYOffset,
      wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.top - 30 - wrenchArrowYOffset, wrenchArrowOptions );
    var wrenchBottomArrow = new ArrowNode( wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.bottom + wrenchArrowYOffset,
      wrenchImageNode.centerX + wrenchArrowXOffset, wrenchImageNode.bottom + 30 + wrenchArrowYOffset, wrenchArrowOptions );
    var wrench = new Node( {
      children: [
        wrenchImageNode,
        wrenchTopArrow,
        wrenchBottomArrow
      ], cursor: 'pointer'
    } );

    wrenchTopArrow.touchArea = wrenchTopArrow.localBounds.dilated( 6 );
    wrenchBottomArrow.touchArea = wrenchBottomArrow.localBounds.dilated( 6 );
    wrench.touchArea = Shape.bounds( wrenchImageNode.bounds.dilated( Constants.dilatedTouchArea ) );
    wrench.mouseArea = Shape.bounds( wrenchImageNode.bounds );


    /*---------------------------------------------------------------------------*
     * Post
     *----------------------------------------------------------------------------*/
    var post = new Rectangle( Constants.offsetWheel.x - 5, 0, 10, postNodeHeight, {
      stroke: '#000',
      fill: Constants.postGradient
    } );

    /*---------------------------------------------------------------------------*
     * Piston Box
     *----------------------------------------------------------------------------*/
    var pistonBox = new ShadedRectangle( Bounds2.point( Constants.offsetWheel.x, Constants.offsetWheel.y ).dilatedXY( 40, 25 ), {
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
    new Node( { children: [ post ], scale: postScale } ).toImageNodeAsynchronous( function( image ) {
      postCache.addChild( image );
    } );
    post = new Node( { children: [ postCache ] } );

    self.addChild( post );
    self.addChild( pistonBox );
    self.addChild( wrench );
    self.addChild( new Node( { children: [ wheel ], translation: Constants.offsetWheel } ) );

    wrench.addInputListener( Constants.dragAndDropHandler( wrench, function( point ) {
      model.nextLeftY = Math.max( Math.min( point.y, options.range.max ), options.range.min );
      model.playProperty.set( true );
      model.yNowChanged.emit();
    }, function endCallback( event, trail ) {
      if ( event.target !== wrenchTopArrow && event.target !== wrenchBottomArrow ) {
        model.wrenchArrowsVisibleProperty.set( false );
      }
    }, function endCallback( event, trail ) {
      model.wrenchArrowsVisibleProperty.set( false );
    } ) );
    model.wrenchArrowsVisibleProperty.link( function( value ) {
      wrenchTopArrow.visible = value;
      wrenchBottomArrow.visible = value;
    } );

    self.mutate( options );
    function updateKey() {
      if ( wrench.isVisible() ) {
        wrench.y = model.yNow[ 0 ];
      }
    }

    function updatePost() {
      var y = model.yNow[ 0 ];
      if ( post.isVisible() ) {
        // TODO: reduce garbage allocation here
        post.setMatrix( Matrix3.createFromPool( 1, 0, 0,
          0, ( Constants.offsetWheel.y - (y + 7) ) / postNodeHeight, y + 7,
          0, 0, 1 ) );
      }
    }

    var dirty = true;
    model.yNowChanged.addListener( function() { dirty = true; } );
    frame.addListener( function() {
      if ( dirty ) {
        updateKey();
        updatePost();
        dirty = false;
      }
    } );

    // workaround for image not being perfectly centered
    // wheel.addChild( new Circle( 29.4, { stroke: '#333', lineWidth: 1.4 } ) );

    var wheelScaleMatrix = Matrix3.scale( 1 / wheelImageScale );
    model.angleProperty.link( function updateWheel( value ) {
      // wheel.rotation = value;
      // wheel.setMatrix( Matrix3.rotation2( value ) ); // doesn't need to compute current transform, or do matrix multiplication
      wheel.setMatrix( Matrix3.rotation2( value ).timesMatrix( wheelScaleMatrix ) ); // doesn't need to compute current transform, or do matrix multiplication
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

  waveOnAString.register( 'StartNode', StartNode );

  inherit( Node, StartNode );
  return StartNode;
} );
