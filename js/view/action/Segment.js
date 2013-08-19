/**
 * Copyright 2002-2013, University of Colorado
 * Segment view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function Segment( x, y, color, radius ) {
    Node.call( this, {x: x, y: y} );
    this.addChild( new Circle( radius, {
      fill: new RadialGradient( -radius * 0.5, -radius * 0.5, 1, -radius * 0.5, -radius * 0.5, radius )
        .addColorStop( 0, "#FFF" )
        .addColorStop( 0.3, color ),
      stroke: "#000",
      lineWidth: 0.5
    } ) );
  }

  inherit( Node, Segment );

  return Segment;
} );