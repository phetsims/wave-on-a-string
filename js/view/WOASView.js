/**
 * Copyright 2002-2013, University of Colorado
 * Main view.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var ControlPanel = require( 'WOAS/view/ControlPanel' );
  var ActionView = require( 'WOAS/view/ActionView' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Events = require( 'AXON/Events' );

  function WOASView( model ) {
    ScreenView.call( this, {renderer: 'svg'} );
    
    this.events = new Events();
    
    this.addChild( new ControlPanel( model ) );
    this.addChild( new ActionView( model, this.events ) );
  }

  inherit( ScreenView, WOASView, {
    step: function( time ) {
      this.events.trigger( 'frame' );
    }
  } );
  return WOASView;
} );
