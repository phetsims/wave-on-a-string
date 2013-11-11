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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function StartNode( model, options ) {
    options = _.extend( {renderer:'canvas', layerSplit: true }, options );

    Node.call( this );
    var thisNode = this,
      wheelImg,
      key = new Node( {children: [new Image( require( 'image!WOAS/wrench_2.svg' ), {x: -40, y: -25, scale: 0.9} )], cursor: 'pointer'} ),
      wheel = new Node( {children: [wheelImg = new Image( require( 'image!WOAS/oscillator_wheel.png' ), {scale: 0.4} )]} ),
      post = new Rectangle( Constants.offsetWheel.x - 5, Constants.offsetWheel.y, 10, 0, {
        stroke: '#000',
        fill: Constants.postGradient
      } );
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
    model.on( 'yNowChanged', function updateKey() {
      key.y = model.yNow[0];
      post.setRect( Constants.offsetWheel.x - 5, key.y + 7, 10, Constants.offsetWheel.y - (key.y + 7) );
    } );
    model.angleProperty.link( function updateWheel( value ) {
      wheel.rotation = value;
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
