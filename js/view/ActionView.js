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
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Image = require( 'SCENERY/nodes/Image' );

  function ActionView( model ) {
    Node.call( this, { layerSplit: true } );
    var arrowShape = new Shape(),
      windowImage;
    //REVIEW: why is this called arrowShape? maybe 'referenceLine' would be more appropriate?
    arrowShape.moveTo( 0, 0 );
    arrowShape.lineTo( 605, 0 );
    this.addChild( new Path( arrowShape, {
      stroke: "#FFA91D",
      lineDash: [8, 5],
      lineWidth: 2,
      x: 70,
      y: 215
    } ) );

    /*REVIEW:
     * There are many constants here which should not be duplicated. I would recommend a 'Constants.js' file, similar to
     * https://github.com/phetsims/build-a-molecule/blob/master/js/Constants.js, where the x,y resting values of the left/right side of the string are stored,
     * and any constants used for large-scale layout. I'd also recommend putting colors in this area.
     */
    this.addChild( new EndNode( model, {x: 670, y: 215, max: 120, min: -120} ) );
    this.addChild( new TheStringNode( model, {x: 70, y: 215, radius: 5, max: 120, min: -120} ) );
    this.addChild( new StartNode( model, {x: 70, y: 215, max: 120, min: -120} ) );
    this.addChild( windowImage = new Node( {children: [new Image( require( 'image!WOAS/window_edge.png' ), {x: -19, y: -210 / 2, scale: 1} )], x: 90 + 600, y: 215} ) );

    model.typeEndProperty.link( function updateVisible( value ) {
      windowImage.setVisible( value === 'noEnd' );
    } );
  }

  inherit( Node, ActionView );

  return ActionView;
} );
