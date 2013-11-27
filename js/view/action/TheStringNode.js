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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Constants = require( 'WOAS/Constants' );

  function TheStringNode( model, options ) {
    Node.call( this, {layerSplit: true} );
    var color,
      theStringShape = new Shape(),
      theStringPath = new Path( theStringShape, {
        stroke: '#F00'
      } ),
      theString = [];
    this.addChild( theStringPath );

    for ( var i = 0; i < model.yDraw.length; i++ ) {
      color = 'red';
      if ( i % 10 === 0 ) {
        color = 'lime';
      }
      theString.push( new Circle( options.radius, {x: i * options.radius * 2, fill: Constants.segmentTheStringNodeGradient( {radius: options.radius, color: color} ), stroke: 'black', lineWidth: 0.5} ) );
    }
    theString[0].scale( 1.2 );
    this.addChild( new Node( {children: theString} ) );

    this.mutate( options );

    model.on( 'yNowChanged', function updateTheString() {
      theStringShape = new Shape();
      for ( var i = 0; i < model.yDraw.length; i++ ) {
        theString[i].y = model.yDraw[i];
        /*REVIEW:
         * A lot of the performance issues relate to this shape drawing. There's nothing you can do here,
         * I'll hopefully have speed improvements to Kite's Shape soon to make this much faster. Sorry!
         */
        theStringShape.lineTo( i * options.radius * 2, model.yDraw[i] || 0 );
      }
      theStringPath.shape = theStringShape;
    } );
  }

  inherit( Node, TheStringNode );

  return TheStringNode;
} );
