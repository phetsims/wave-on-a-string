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
  var Segment = require( 'WOAS/view/action/Segment' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  function TheStringNode( model, options ) {
    Node.call( this );
    var color,
      theStringShape = new Shape(),
      theStringRectShape = new Shape(),
      theStringPath = new Path( theStringShape, {
        stroke: '#F00', layerSplit: true
      } ),
      theStringRectPath = new Path( theStringRectShape, {
        fill: '#FFFFB7', layerSplit: true
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
    //REVIEW: renderer: 'svg' is specified in WOASView, unnecessary here
    this.addChild( new Node( {children: theString, renderer: 'svg', layerSplit: true} ) );

    this.mutate( options );

    //REVIEW: please replace with model.on( 'yNowChanged', function updateTheString() { ... } ) as suggested in WOASModel.js review notes
    //model.yNowChangedProperty.link(
    model.on( 'yNowChanged', function updateTheString() {
      theStringShape = new Shape();
      theStringRectShape = new Shape();
      var maxY = 0, minY = 0;

      //REVIEW: is yDraw[...] ever undefined? if possible, please modify the code so yDraw[...] is always defined and non-NaN so we don't need '|| 0'
      theStringShape.moveTo( 0, model.yDraw[0] || 0 );
      for ( var i = 0; i < model.yDraw.length; i++ ) {
        maxY = Math.max( maxY, model.yDraw[i] + options.radius || 0 );
        minY = Math.min( minY, model.yDraw[i] - options.radius || 0 );
        theString[i].y = model.yDraw[i] || 0;
        /*REVIEW:
         * A lot of the performance issues relate to this shape drawing. There's nothing you can do here,
         * I'll hopefully have speed improvements to Kite's Shape soon to make this much faster. Sorry!
         */
        theStringShape.lineTo( i * options.radius * 2, model.yDraw[i] || 0 );
      }
      theStringPath.shape = theStringShape;

      //REVIEW: please use SCENERY/nodes/Rectangle for theStringRectPath instead of SCENERY/nodes/Path (see other comments about Rectangle for info)
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
