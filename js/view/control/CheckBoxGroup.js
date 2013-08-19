/**
 * Copyright 2002-2013, University of Colorado
 * Control vertical CheckBox view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function CheckBoxGroup( options ) {
    Node.call( this, {x: options.x, y: options.y} );
    var i = 0,
      length = options.check.length;
    for ( ; i < length; i++ ) {
      this.addChild( new Node( {children: [new Rectangle( 0, ((i + 1) * 33 - 22), 22, 22, 5, 5, {fill: "#FFF"} ), new CheckBox( new Text( options.check[i].text, { fontSize: 15 } ), options.check[i].property, {y: (i + 1) * 33} )]} ) );
    }
    this.addChild( new Path( { shape: Shape.lineSegment( -10, 10, -10, this.height ), stroke: 'gray', lineWidth: 1 } ) );
  }

  inherit( Node, CheckBoxGroup );

  return CheckBoxGroup;
} );