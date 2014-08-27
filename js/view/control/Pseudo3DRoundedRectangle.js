/**
 * Copyright 2002-2013, University of Colorado
 *
 * A pseudo-3D rectangle abstraction

 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  // var LineStyles = require( 'KITE/util/LineStyles' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // TODO: better API, not just bounds? support Rectangle API, potentially extend.
  function Pseudo3DRoundedRectangle( rectBounds, options ) {
    Node.call( this );

    // TODO: extracted translation, touchArea,

    options = _.extend( {
      // defaults
      baseColor: new Color( 80, 130, 230 ),
      lightFactor: 0.5,
      lighterFactor: 0.1,
      darkFactor: 0.5,
      darkerFactor: 0.1,
      cornerRadius: 10
    }, options );

    var cornerRadius = options.cornerRadius;

    var baseColor = options.baseColor;
    var lighterColor = baseColor.colorUtilsBrighter( options.lightFactor + options.lighterFactor );
    var lightColor = baseColor.colorUtilsBrighter( options.lightFactor );
    var darkColor = baseColor.colorUtilsDarker( options.darkFactor );
    var darkerColor = baseColor.colorUtilsDarker( options.darkFactor + options.darkerFactor );

    var lightOffset = 0.07 * 7.5 * cornerRadius;
    var darkOffset = 0.05 * 7.5 * cornerRadius;

    var panelBackground = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {} );
    var panelEffect = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {} );

    panelBackground.fill = new LinearGradient( panelBackground.left, 0, panelBackground.width, 0 )
      .addColorStop( 0, lightColor )
      .addColorStop( lightOffset / panelEffect.width, baseColor )
      .addColorStop( 1 - darkOffset / panelEffect.width, baseColor )
      .addColorStop( 1, darkColor );

    panelEffect.fill = new LinearGradient( 0, panelEffect.top, 0, panelEffect.bottom )
      .addColorStop( 0, lighterColor )
      .addColorStop( lightOffset / panelEffect.height, lighterColor.withAlpha( 0 ) )
      .addColorStop( 1 - darkOffset / panelEffect.height, darkerColor.withAlpha( 0 ) )
      .addColorStop( 1, darkerColor );

    var lightCorner = new Path( new Shape().moveTo( 0, 0 )
                                           .arc( 0, 0, cornerRadius, -Math.PI, -Math.PI / 2, false )
                                           .close(), {
      x: panelEffect.left + cornerRadius,
      y: panelEffect.top + cornerRadius,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, baseColor )
        .addColorStop( 1 - lightOffset / cornerRadius, baseColor )
        .addColorStop( 1, lighterColor )
    } );

    var darkCorner = new Path( new Shape().moveTo( 0, 0 )
                                          .arc( 0, 0, cornerRadius, 0, Math.PI / 2, false )
                                          .close(), {
      x: panelEffect.right - cornerRadius,
      y: panelEffect.bottom - cornerRadius,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, baseColor )
        .addColorStop( 1 - darkOffset / cornerRadius, baseColor )
        .addColorStop( 1, darkerColor )
    } );

    // the stroke around the outside
    var panelStroke = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {
      stroke: darkColor.withAlpha( 0.4 )
    } );

    this.addChild( panelBackground );
    this.addChild( panelEffect );
    this.addChild( lightCorner );
    this.addChild( darkCorner );
    this.addChild( panelStroke );

    this.mutate( options );
  }

  inherit( Node, Pseudo3DRoundedRectangle );

  return Pseudo3DRoundedRectangle;
} );
