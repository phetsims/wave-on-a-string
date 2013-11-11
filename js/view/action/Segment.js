/**
 * Copyright 2002-2013, University of Colorado
 * Segment view
 *REVIEW: doc: View for a single segment of the string
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /*REVIEW
   * Since this appears to just be a Circle, we can shorten the depth of the Scenery tree by removing
   * this extra node and have Segment inherit from Circle directly.
   *
   * I would recommend:
   * function Segment( color, radius, options ) {
   *   Circle.call( this, radius, _.extend( {
   *     fill: new RadialGradient( -radius * 0.5, -radius * 0.5, 1, -radius * 0.5, -radius * 0.5, radius )
   *               .addColorStop( 0, '#FFF' )
   *               .addColorStop( 0.3, color ),
   *     stroke: 'black',
   *     lineWidth: 0.5
   *   }, options ) );
   * }
   * inherit( Circle, Segment );
   *
   * And creating a new segment with:
   * new Segment( color, radius, { x: <x>, y: <y> } );
   *
   * Thus the depth in the tree of the Circle is one shorter (slight performance benefit for rendering in Scenery).
   *
   * The x/y change allows creating a Segment without specifying either x/y (and then setting it later), and the example
   * allows passing through arbitrary options for the Scenery Node. This is accomplished by using _.extend, which
   * copies properties from the 2nd argument (options) into the 1st argument (list of other options passed to Circle).
   * Since at the one place we call 'new Segment' right now y is 0, so we can instantiate with only { x: ... }
   */
  function Segment( x, y, color, radius ) {
    Node.call( this, {x: x, y: y} );
    this.addChild( new Circle( radius, {
      fill: new RadialGradient( -radius * 0.5, -radius * 0.5, 1, -radius * 0.5, -radius * 0.5, radius )
        .addColorStop( 0, '#FFF' )
        .addColorStop( 0.3, color ),
      stroke: '#000',
      lineWidth: 0.5
    } ) );
  }

  inherit( Node, Segment );

  return Segment;
} );
