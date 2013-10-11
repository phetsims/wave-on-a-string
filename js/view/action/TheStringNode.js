/**
 * Copyright 2002-2013, University of Colorado
 * the Strings node view
 *
 * Author: Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Segment = require( 'view/action/Segment' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );


  function TheStringNode( x, y, model, options ) {
    Node.call( this, {x: x, y: y, scale: 1 } );
    var color,
      theStringShape = new Shape(),
      theStringRectShape = new Shape(),
      theStringPath = new Path( theStringShape, {
        stroke: "#F00",
        lineWidth: 1, renderer: 'svg', layerSplit: true
      } ),
      theStringRectPath = new Path( theStringRectShape, {
        fill: "#FFFFB7", renderer: 'svg', layerSplit: true
      } ),
      theString = [];
    this.addChild( theStringPath );

    for ( var i = 0; i < model.yDraw.length; i++ ) {
      color = 'red';
      if ( i % 10 === 0 ) {
        color = 'lime';
      }
      /*REVIEW: consider Segment API change from Segment.js, as this would then be:
       * theString.push( new Segment( color, options.radius, { x: i * options.radius * 2 } ) );
       */
      theString.push( new Segment( i * options.radius * 2, 0, color, options.radius ) );
    }
    theString[0].scale( 1.2 );
    this.addChild( new Node( {children: theString, renderer: 'svg', layerSplit: true} ) );
    //REVIEW: please replace with model.on( 'yNowChanged', function updateTheString() { ... } ) as suggested in WOASModel.js review notes
    model.yNowChangedProperty.link( function updateTheString() {
      theStringShape = new Shape();
      theStringRectShape = new Shape();
      var maxY = 0, minY = 0;
      theStringShape.moveTo( 0, model.yDraw[0] || 0 );
      for ( var i = 0; i < model.yDraw.length; i++ ) {
        maxY = Math.max( maxY, model.yDraw[i] + options.radius || 0 );
        minY = Math.min( minY, model.yDraw[i] - options.radius || 0 );
        theString[i].y = model.yDraw[i] || 0;
        theStringShape.lineTo( i * options.radius * 2, model.yDraw[i] || 0 );
      }
      theStringPath.shape = theStringShape;
      theStringRectShape.moveTo( 0, minY );
      theStringRectShape.lineTo( 590, minY );
      theStringRectShape.lineTo( 590, maxY );
      theStringRectShape.lineTo( 0, maxY );
      theStringRectShape.close();
      theStringRectPath.shape = theStringRectShape;
    } );
  }

  inherit( Node, TheStringNode );

  return TheStringNode;
} );
