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
  var Bounds2 = require( 'DOT/Bounds2' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );

  function StartNode( model, options ) {
    options = _.extend( { layerSplit: true }, options );
    Node.call( this );
    var thisNode = this,
      key = new Node( {children: [new Image( require( 'image!WOAS/wrench_2.svg' ), {x: -40, y: -25, scale: 0.9} )], cursor: 'pointer'} ),
      wheel = new Node( {children: [new Image( require( 'image!WOAS/oscillator_wheel.png' ), {x: -90 * 0.4, y: -90 * 0.4, scale: 0.4} )]} ),
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
    var clickYOffset = 0;
    key.touchArea = Shape.bounds( Bounds2.point( -12, 70 ).dilatedXY( key.width / 2, key.height / 2 ) );
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
    this.mutate( options );
    //REVIEW: please replace with model.on( 'yNowChanged', function updateKey() { ... } ) as suggested in WOASModel.js review notes
    //model.yNowChangedProperty.link(
    model.on( 'yNowChanged', function updateKey() {
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
