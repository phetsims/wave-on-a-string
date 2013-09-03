/**
 * Copyright 2002-2013, University of Colorado
 * Rectangle background the Strings
 *
 * Author: Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );


  function TheStringNodeRect( x, y, model, options ) {
    Node.call( this, {x: x, y: y, scale: 1, renderer: 'svg', layerSplit: true } );
    var theStringRectShape = new Shape(),
      theStringRectPath = new Path( theStringRectShape, {
        fill: "#FFFFB7", renderer: 'svg', layerSplit: true
      } );
    this.addChild( theStringRectPath );
    model.yNowChangedProperty.link( function updateTheStringRect() {
      theStringRectShape = new Shape();
      var maxY = 0, minY = 0;
      for ( var i = 0; i < model.yNow.length; i++ ) {
        maxY = Math.max( maxY, model.yNow[i] + options.radius || 0 );
        minY = Math.min( minY, model.yNow[i] - options.radius || 0 );
      }
      theStringRectShape.moveTo( 0, minY );
      theStringRectShape.lineTo( 590, minY );
      theStringRectShape.lineTo( 590, maxY );
      theStringRectShape.lineTo( 0, maxY );
      theStringRectShape.close();
      theStringRectPath.shape = theStringRectShape;
    } );
  }

  inherit( Node, TheStringNodeRect );

  return TheStringNodeRect;
} );