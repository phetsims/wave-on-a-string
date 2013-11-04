/**
 * Copyright 2002-2013, University of Colorado
 * Control Restart button view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var restartString = require( 'string!WOAS/restart' );
  var TextButton = require( 'SUN/TextButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function RestartButton( model, options ) {
    //REVIEW: prefer passing options directly down to Node
    //REVIEW: scale: 1 is the default, should be removed
    Node.call( this, {x: options.x, y: options.y, scale: 1} );

    var restart = function() {
      model.manualRestart();
    };

    //REVIEW: scale: 1 is the default, should be removed
    this.addChild(new TextButton( restartString, {listener: restart, font: new PhetFont( 12 ),rectangleFillUp:"#DED322",rectangleFillDown:"#DED322",rectangleFillOver:"#E6D739"} ), {scale: 1});
  }

  inherit( Node, RestartButton );

  return RestartButton;
} );
