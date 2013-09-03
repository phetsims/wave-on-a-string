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
    Node.call( this, {x: x, y: y, scale: 1/*, renderer: 'svg', layerSplit: true*/ } );
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
    //this.addChild( theStringRectPath );
    this.addChild( theStringPath );

    for ( var i = 0; i < model.yNow.length; i++ ) {
      color = 'red';
      if ( i % 10 === 0 ) {
        color = 'lime';
      }
      theString.push( new Segment( i * options.radius * 2, 0, color, options.radius ) );
    }
    theString[0].scale( 1.2 );
    this.addChild( new Node( {children: theString, renderer: 'svg', layerSplit: true} ) );
    model.yNowChangedProperty.link( function updateTheString() {
      theStringShape = new Shape();
      theStringRectShape = new Shape();
      var maxY = 0, minY = 0;
      theStringShape.moveTo( 0, model.yNow[0] || 0 );
      for ( var i = 0; i < model.yNow.length; i++ ) {
        maxY = Math.max( maxY, model.yNow[i] + options.radius || 0 );
        minY = Math.min( minY, model.yNow[i] - options.radius || 0 );
        theString[i].y = model.yNow[i] || 0;
        theStringShape.lineTo( i * options.radius * 2, model.yNow[i] || 0 );
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