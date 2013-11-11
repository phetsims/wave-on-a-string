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
  var TextPushButton = require( 'SUN/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  function RestartButton( model, options ) {
    Node.call( this );

    var restart = function() {
      model.manualRestart();
    };

    this.addChild(new TextPushButton( restartString, {listener: restart, font: new PhetFont( 12 ),rectangleFillUp:'#DED322',rectangleFillDown:'#DED322',rectangleFillOver:'#E6D739'} ));
    this.mutate( options );
  }

  inherit( Node, RestartButton );

  return RestartButton;
} );
