// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Gravity Force Lab' sim.
 *
 * @author Anton Ulyanov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var SimLauncher = require( 'JOIST/SimLauncher' ),
    Sim = require( 'JOIST/Sim' ),
    Strings = require( 'Strings' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' ),
    WOASModel = require( 'model/WOASModel' ),
    WOASView = require( 'view/WOASView' ),
    imageLoader = require( 'imageLoader' );

  var simOptions = {
    credits: 'PhET Development Team -\n' +
             'Lead Design: Michael Dubson\n' +
             'Software Development: Michael Dubson\n' +
             'Interviews: Wendy Adams, Danielle Harlow\n',
    thanks: 'Thanks -\n' +
            'Conversation of this simulation to HTML5 was funded by the Royal Society of Chemistry.'
  };

  SimLauncher.launch( imageLoader, function() {
    //Create and start the sim
    new Sim( Strings.simTitle, [
      {
        name: Strings.simTitle,
        icon: new Rectangle( 0, 0, 50, 50, { fill: 'blue' } ),
        createModel: function() { return new WOASModel( 768, 504 ); },
        createView: function( model ) { return new WOASView( model ); },
        backgroundColor: "#FFF9BA"
      }
    ], simOptions ).start();
  } );
} );
