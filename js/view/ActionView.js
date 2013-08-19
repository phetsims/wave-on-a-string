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
  var TheStringNode = require( 'view/action/TheStringNode' );
  var StartNode = require( 'view/action/StartNode' );
  var EndNode = require( 'view/action/EndNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var imageLoader = require( 'imageLoader' );
  var Image = require( 'SCENERY/nodes/Image' );

  function ActionView( model ) {

    Node.call( this, { scale: 1, renderer: 'svg', layerSplit: true } );
    var arrowShape = new Shape(),
      window;
    arrowShape.moveTo( 0, 0 );
    arrowShape.lineTo( 605, 0 );
    this.addChild( new Path( {
      shape: arrowShape,
      stroke: "#FFA91D",
      lineDash: [8, 8],
      lineWidth: 2,
      x: 70,
      y: 215
    } ) );

    this.addChild( new EndNode( 70 + 600, 215, model, {max: 120, min: -120} ) );
    this.addChild( new TheStringNode( 70, 215, model, {radius: 5, max: 120, min: -120} ) );
    this.addChild( new StartNode( 70, 215, model, {max: 120, min: -120} ) );
    this.addChild( window = new Node( {children: [new Image( imageLoader.getImage( 'window_edge.png' ), {x: -19, y: -210 / 2, scale: 1} )], x: 90 + 600, y: 215} ) );

    model.typeEndProperty.link( function updateVisible( value ) {
      window.setVisible( value === 'noEnd' );
    } );
  }

  inherit( Node, ActionView );

  return ActionView;
} );