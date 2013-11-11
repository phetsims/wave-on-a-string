/**
 * Copyright 2002-2013, University of Colorado
 * Action view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TheStringNode = require( 'WOAS/view/action/TheStringNode' );
  var StartNode = require( 'WOAS/view/action/StartNode' );
  var EndNode = require( 'WOAS/view/action/EndNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Constants = require( 'WOAS/Constants' );

  function ActionView( model ) {
    Node.call( this, { layerSplit: true } );
    var windowImage;
    //center line
    this.addChild(new Line(0,0,605,0,{
      stroke: '#FFA91D',
      lineDash: [8, 5],
      lineWidth: 2,
      x: Constants.startTheStringNode,
      y: Constants.yTheStringNode
    }));
    this.addChild( new EndNode( model, {x: Constants.endTheStringNode, y: Constants.yTheStringNode} ) );
    this.addChild( new TheStringNode( model, {x: Constants.startTheStringNode, y: Constants.yTheStringNode, radius: Constants.segmentTheStringNodeRadius} ) );
    this.addChild( new StartNode( model, {x: Constants.startTheStringNode, y: Constants.yTheStringNode, range:Constants.yKeyRange} ) );
    this.addChild( windowImage = new Node( {children: [new Image( require( 'image!WOAS/window_edge.png' ), {x: 1, y: -105} )], x: Constants.endTheStringNode, y: Constants.yTheStringNode} ) );

    model.typeEndProperty.link( function updateVisible( value ) {
      windowImage.setVisible( value === 'noEnd' );
    } );
  }

  inherit( Node, ActionView );

  return ActionView;
} );
