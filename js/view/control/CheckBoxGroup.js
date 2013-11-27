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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Bounds2 = require( 'DOT/Bounds2' );

  function CheckBoxGroup( options ) {
    var defaultOptions = {
      check: []
    };
    options = _.extend( {}, defaultOptions, options );
    Node.call( this );
    for ( var i = 0; i < options.check.length; i++ ) {
      var checkBox;
      //this rectangle - white background for checkbox
      this.addChild(new Rectangle( 0, ((i + 1) * 33 - 22), 22, 22, 5, 5, {fill: '#FFF'} ));
      this.addChild(checkBox = new CheckBox( new Text( options.check[i].text, { font: new PhetFont( 15 ) } ), options.check[i].property, {y: (i + 1) * 33} ));
      //set touchArea and mouseArea
      checkBox.touchArea = Shape.bounds( Bounds2.rect(0,-checkBox.height,checkBox.width,checkBox.height).dilatedXY( 10, 5 ) );
      checkBox.mouseArea = Shape.bounds( Bounds2.rect(0,-checkBox.height,checkBox.width,checkBox.height) );
    }
    this.addChild( new Path( Shape.lineSegment( -10, 10, -10, this.height ), { stroke: 'gray', lineWidth: 1 } ) );
    this.mutate( _.omit( options, Object.keys( defaultOptions ) ) );
  }

  inherit( Node, CheckBoxGroup );

  return CheckBoxGroup;
} );
