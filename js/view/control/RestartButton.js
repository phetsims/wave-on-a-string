/**
 * Copyright 2002-2013, University of Colorado
 * Control Restart button view
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // strings
  var restartString = require( 'string!WOAS/restart' );

  function RestartButton( model, options ) {
    TextPushButton.call( this, restartString, {
      listener: model.manualRestart.bind( model ),
      font: new PhetFont( 12 ),
      baseColor: '#DED322'
    } );
    this.touchArea = Shape.bounds( Bounds2.rect( 0, 0, this.width, this.height ).dilatedXY( 5, 20 ) );
    this.mouseArea = Shape.bounds( Bounds2.rect( 0, 0, this.width, this.height ) );
    this.mutate( options );
  }

  inherit( TextPushButton, RestartButton );

  return RestartButton;
} );
