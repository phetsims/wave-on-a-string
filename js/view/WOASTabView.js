/**
 * Copyright 2002-2013, University of Colorado
 * main TabView container.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var ActionView = require( 'view/ActionView' );
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TheStringNodeRect = require( 'view/action/TheStringNodeRect' );

  function WOASTabView( model ) {
    TabView.call( this, {renderer: 'svg'} );
    this.addChild( new TheStringNodeRect( 70, 215, model, {radius: 5, max: 120, min: -120} ) );
    this.addChild( new ControlPanel( model ) );
    this.addChild( new ActionView( model ) );

  }

  inherit( TabView, WOASTabView );
  return WOASTabView;
} );