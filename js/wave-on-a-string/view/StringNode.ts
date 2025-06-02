// Copyright 2013-2025, University of Colorado Boulder

/**
 * View for the string
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import waveOnAString from '../../waveOnAString.js';
import type WOASModel from '../model/WOASModel.js';

type SelfOptions = {
  radius: number;
};

export type StringNodeOptions = SelfOptions & NodeOptions;

export default class StringNode extends Node {
  public constructor( model: WOASModel, frameEmitter: Emitter, providedOptions?: StringNodeOptions ) {
    super();

    const options = optionize<StringNodeOptions, SelfOptions, NodeOptions>()( {
      layerSplit: true
    }, providedOptions );

    let stringShape = new Shape();
    const stringPath = new Path( stringShape, {
      stroke: '#F00'
    } );
    const beads: Node[] = [];
    this.addChild( stringPath );

    stringPath.computeShapeBounds = function() {
      return this.getShape()!.bounds.dilated( 20 ); // miterLimit should cut off with the normal stroke before this
    };

    const highlightCircle = new Circle( options.radius * 0.3, {
      fill: '#fff',
      x: -0.45 * options.radius,
      y: -0.45 * options.radius
    } );
    const scale = 3;
    const redBead = new Circle( options.radius, {
      fill: 'red',
      stroke: 'black',
      lineWidth: 0.5,
      children: [ highlightCircle ],
      scale: scale
    } );
    const limeBead = new Circle( options.radius, {
      fill: 'lime',
      stroke: 'black',
      lineWidth: 0.5,
      children: [ highlightCircle ],
      scale: scale
    } );

    let redNode!: Image;
    redBead.toDataURL( ( url, x, y ) => {
      redNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    let limeNode!: Image;
    limeBead.toDataURL( ( url, x, y ) => {
      limeNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    for ( let i = 0; i < model.yDraw.length; i++ ) {
      const bead = ( i % 10 === 0 ) ? limeNode : redNode;
      beads.push( new Node( { x: i * options.radius * 2, children: [ bead ] } ) );
    }
    beads[ 0 ].scale( 1.2 );
    this.addChild( new Node( { children: beads } ) );

    this.mutate( options );

    let dirty = true;
    model.yNowChangedEmitter.addListener( () => {
      dirty = true;
    } );
    frameEmitter.addListener( () => {
      if ( dirty ) {
        stringShape = new Shape();
        beads[ 0 ].y = model.nextLeftYProperty.value;
        stringShape.lineTo( 0, model.nextLeftYProperty.value || 0 );
        for ( let i = 1; i < model.yDraw.length; i++ ) {
          beads[ i ].y = model.yDraw[ i ];
          /*REVIEW:
           * A lot of the performance issues relate to this shape drawing. There's nothing you can do here,
           * I'll hopefully have speed improvements to Kite's Shape soon to make this much faster. Sorry!
           */
          stringShape.lineTo( i * options.radius * 2, model.yDraw[ i ] || 0 );
        }
        stringPath.shape = stringShape;

        dirty = false;
      }
    } );
  }
}

waveOnAString.register( 'StringNode', StringNode );