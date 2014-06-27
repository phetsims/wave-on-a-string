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

  function TheStringNode( model, events, options ) {
    Node.call( this, {layerSplit: true} );
    var theStringShape = new Shape(),
      theStringPath = new Path( theStringShape, {
        stroke: '#F00'
      } ),
      theString = [];
    this.addChild( theStringPath );

    theStringPath.computeShapeBounds = function() {
      return this.getShape().bounds.dilated( 20 ); // miterLimit should cut off with the normal stroke before this
    };

    var highlightCircle = new Circle( options.radius * 0.3, { fill: '#fff', x: -0.45 * options.radius, y: -0.45 * options.radius } );
    var scale = 3;
    var redBead = new Circle( options.radius, { fill: 'red', stroke: 'black', lineWidth: 0.5, children: [highlightCircle], scale: scale } );
    var limeBead = new Circle( options.radius, { fill: 'lime', stroke: 'black', lineWidth: 0.5, children: [highlightCircle], scale: scale } );

    var redBase = new Node( { scale: 1 / scale } );
    var limeBase = new Node( { scale: 1 / scale } );
    redBead.toImageNodeAsynchronous( function( image ) {
      redBase.addChild( image );
    } );
    limeBead.toImageNodeAsynchronous( function( image ) {
      limeBase.addChild( image );
    } );

    for ( var i = 0; i < model.yDraw.length; i++ ) {
      var bead = ( i % 10 === 0 ) ? limeBase : redBase;
      theString.push( new Node( { x: i * options.radius * 2, children: [bead] } ) );
    }
    theString[0].scale( 1.2 );
    this.addChild( new Node( {children: theString} ) );

    this.mutate( options );

    function updateTheString() {
      theStringShape = new Shape();
      theString[0].y = model.nextLeftY;
      theStringShape.lineTo( 0, model.nextLeftY || 0 );
      for ( var i = 1; i < model.yDraw.length; i++ ) {
        theString[i].y = model.yDraw[i];
        /*REVIEW:
         * A lot of the performance issues relate to this shape drawing. There's nothing you can do here,
         * I'll hopefully have speed improvements to Kite's Shape soon to make this much faster. Sorry!
         */
        theStringShape.lineTo( i * options.radius * 2, model.yDraw[i] || 0 );
      }
      theStringPath.shape = theStringShape;
    }

    var dirty = true;
    model.on( 'yNowChanged', function() { dirty = true; } );
    events.on( 'frame', function() {
      if ( dirty ) {
        updateTheString();
        dirty = false;
      }
    } );
  }

  inherit( Node, TheStringNode );

  return TheStringNode;
} );
