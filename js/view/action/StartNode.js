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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function StartNode( x, y, model, options ) {
    //REVIEW: scale: 1 not necessary, that's the default
    //REVIEW: renderer: 'svg' not necessary, it's always specified in the main WOASView
    /*REVIEW
     * We generally prefer the style where the x/y is passed into the options in the constructor, and is
     * fowarded to the Node constructor by using something like:
     * Node.call( this, _.extend( { layerSplit: true }, options ) );
     * where instead of new StartNode( x, y, model, { ... } ), we use new StartNode( model, { x: x, y: y, ... } )
     *
     * This is essentially like adding layerSplit: true to options, and passing them to the supertype. Although
     * technically if options' layerSplit is set, that value is used instead. Reading up on underscore's _.extend
     * is beneficial, as it's a function we use a lot.
     */
    Node.call( this, {x: x, y: y, scale: 1, renderer: 'svg', layerSplit: true } );
    var thisNode = this,
      key = new Node( {children: [new Image( require( 'image!WOAS/wrench_2.svg' ), {x: -40, y: -25, scale: 0.9} )], cursor: 'pointer'} ),
      //REVIEW: 'y: 0' does nothing, that is the default
      wheel = new Node( {children: [new Image( require( 'image!WOAS/oscillator_wheel.png' ), {x: -90 * 0.4, y: -90 * 0.4, scale: 0.4} )], y: 0} ),
      postShape = new Shape(),
      //REVIEW: postGradient duplicated between StartNode and EndNode. It should only be specified in one place
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

    //REVIEW: good use if extracting constants here, looks good :)
    var dx = 0.25 * key.width,
      dy = 0.25 * key.height,
      clickYOffset = 0;

    //REVIEW: new way to create this shape: Shape.bounds( Bounds2.point( 0, 0 ).dilated( key.width / 2 + dx, key.height / 2 + dy ) )
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
          //REVIEW: please replace with model.trigger( 'yNowChanged' ) as suggested in WOASModel.js review notes
          model.yNowChanged = !model.yNowChanged;
        }
      } ) );

    //REVIEW: please replace with model.on( 'yNowChanged', function updateKey() { ... } ) as suggested in WOASModel.js review notes
    model.yNowChangedProperty.link( function updateKey() {
      key.y = model.yNow[0] || 0;
      /*REVIEW:
       * Instead of creating a new shape, SCENERY/nodes/Rectangle (the subtype of Node) should be used in
       * place of the Path with a shape.
       * Thus here, we would be calling post.setRect( ... ), a method of Rectangle.
       *
       * In addition, this will allow Scenery in the future to obtain faster performance, particularly after
       * https://github.com/phetsims/scenery/issues/144 is completed.
       */
      postShape = new Shape();
      postShape.moveTo( -5, key.y + 7 );
      postShape.lineTo( 5, key.y + 7 );
      postShape.lineTo( 5, 150 );
      postShape.lineTo( -5, 150 );
      postShape.close();
      post.shape = postShape;
    } );
    model.angleProperty.link( function updateWheel( value ) {
      /*REVIEW:
       * Efficient way to set the wheel's rotation and also avoid needing to wrap the wheel image with an extra Node:
       *
       * wheel.rotation = value;
       *
       * This operation won't affect the wheel's scale (I see the image has a scale of 0.4 above), and it updates
       * the transform in one operation (which currently is much faster than two separate transform operations).
       * In the Scenery future (next few months) this optimization won't be as needed, but it will definitely help.
       *
       * Additionally, to reset the transform matrix to the identity matrix, you can use node.resetTransform(). It
       * doesn't create an extra Matrix3 object, so it's a bit more garbage-collection friendly.
       */
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
