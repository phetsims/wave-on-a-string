/**
 * Copyright 2002-2013, University of Colorado
 * Main view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var ActionView = require( 'view/ActionView' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );

  function WOASView( model ) {
    ScreenView.call( this, {renderer: 'svg'} );
    this.addChild( new ControlPanel( model ) );
    this.addChild( new ActionView( model ) );

  }

  inherit( ScreenView, WOASView );
  return WOASView;
} );