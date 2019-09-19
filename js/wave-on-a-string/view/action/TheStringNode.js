// Copyright 2013-2018, University of Colorado Boulder

/**
 * the Strings node view
 *
 * Author: Anton Ulyanov (Mlearner)
 */

define( require => {
  'use strict';
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Shape = require( 'KITE/Shape' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

  /**
   * @constructor
   * @param {WOASModel} model
   * @param {frameEmitter} frame - emits an event when the animation frame changes
   * @param {Object} [options]
   */
  function TheStringNode( model, frameEmitter, options ) {
    Node.call( this, { layerSplit: true } );
    var theStringShape = new Shape();
    var theStringPath = new Path( theStringShape, {
      stroke: '#F00'
    } );
    var theString = [];
    this.addChild( theStringPath );

    theStringPath.computeShapeBounds = function() {
      return this.getShape().bounds.dilated( 20 ); // miterLimit should cut off with the normal stroke before this
    };

    var highlightCircle = new Circle( options.radius * 0.3, { fill: '#fff', x: -0.45 * options.radius, y: -0.45 * options.radius } );
    var scale = 3;
    var redBead = new Circle( options.radius, { fill: 'red', stroke: 'black', lineWidth: 0.5, children: [ highlightCircle ], scale: scale } );
    var limeBead = new Circle( options.radius, { fill: 'lime', stroke: 'black', lineWidth: 0.5, children: [ highlightCircle ], scale: scale } );

    var redNode;
    redBead.toDataURL( function( url, x, y ) {
      redNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    var limeNode;
    limeBead.toDataURL( function( url, x, y ) {
      limeNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    for ( var i = 0; i < model.yDraw.length; i++ ) {
      var bead = ( i % 10 === 0 ) ? limeNode : redNode;
      theString.push( new Node( { x: i * options.radius * 2, children: [ bead ] } ) );
    }
    theString[ 0 ].scale( 1.2 );
    this.addChild( new Node( { children: theString } ) );

    this.mutate( options );

    function updateTheString() {
      theStringShape = new Shape();
      theString[ 0 ].y = model.nextLeftY;
      theStringShape.lineTo( 0, model.nextLeftY || 0 );
      for ( var i = 1; i < model.yDraw.length; i++ ) {
        theString[ i ].y = model.yDraw[ i ];
        /*REVIEW:
         * A lot of the performance issues relate to this shape drawing. There's nothing you can do here,
         * I'll hopefully have speed improvements to Kite's Shape soon to make this much faster. Sorry!
         */
        theStringShape.lineTo( i * options.radius * 2, model.yDraw[ i ] || 0 );
      }
      theStringPath.shape = theStringShape;
    }

    var dirty = true;
    model.yNowChanged.addListener( function() { dirty = true; } );
    frameEmitter.addListener( function() {
      if ( dirty ) {
        updateTheString();
        dirty = false;
      }
    } );
  }

  waveOnAString.register( 'TheStringNode', TheStringNode );

  inherit( Node, TheStringNode );

  return TheStringNode;
} );
