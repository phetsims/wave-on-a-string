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
  var restartString = require( 'string!WOAS/restart' );
  var TextPushButtonDeprecated = require( 'SUN/TextPushButtonDeprecated' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );

  function RestartButton( model, options ) {
    TextPushButtonDeprecated.call( this, restartString, {
      listener: model.manualRestart.bind( model ),
      font: new PhetFont( 12 ),
      rectangleFillUp: new Color( '#DED322' ),
      rectangleFillDown: new Color( '#DED322' ),
      rectangleFillOver: new Color( '#E6D739' )
    } );
    this.touchArea = Shape.bounds( Bounds2.rect( 0, 0, this.width, this.height ).dilatedXY( 5, 20 ) );
    this.mouseArea = Shape.bounds( Bounds2.rect( 0, 0, this.width, this.height ) );
    this.mutate( options );
  }

  inherit( TextPushButtonDeprecated, RestartButton );

  return RestartButton;
} );
