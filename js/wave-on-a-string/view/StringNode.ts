// Copyright 2013-2025, University of Colorado Boulder

/**
 * View for the string
 *
 * @author Anton Ulyanov (Mlearner)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import waveOnAString from '../../waveOnAString.js';
import type WOASModel from '../model/WOASModel.js';
import { MODEL_UNITS_PER_GAP, NUMBER_OF_BEADS } from '../WOASConstants.js';

type SelfOptions = {
  radius?: number;
};

export type StringNodeOptions = SelfOptions & NodeOptions;

export default class StringNode extends Node {
  public constructor(
    model: WOASModel,
    frameEmitter: Emitter,
    modelViewTransform: ModelViewTransform2,
    providedOptions?: StringNodeOptions
  ) {
    super();

    const options = optionize<StringNodeOptions, SelfOptions, NodeOptions>()( {
      layerSplit: true,
      radius: modelViewTransform.modelToViewDeltaX( MODEL_UNITS_PER_GAP / 2 )
    }, providedOptions );

    const VIEW_X_VALUES = _.range( 0, NUMBER_OF_BEADS ).map( i => modelViewTransform.modelToViewX( i * MODEL_UNITS_PER_GAP ) );

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
    const regularBead = new Circle( options.radius, {
      fill: 'red',
      stroke: 'black',
      lineWidth: 0.5,
      children: [ highlightCircle ],
      scale: scale
    } );
    const referenceBead = new Circle( options.radius, {
      fill: 'rgb(0,0,255)',
      stroke: 'black',
      lineWidth: 0.5,
      children: [ highlightCircle ],
      scale: scale
    } );

    let regularBeadNode!: Image;
    regularBead.toDataURL( ( url, x, y ) => {
      regularBeadNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    let referenceBeadNode!: Image;
    referenceBead.toDataURL( ( url, x, y ) => {
      referenceBeadNode = new Image( url, { x: -x / scale, y: -y / scale, scale: 1 / scale } );
    } );

    for ( let i = 0; i < model.yDraw.length; i++ ) {
      const bead = ( i % 10 === 0 ) ? referenceBeadNode : regularBeadNode;
      beads.push( new Node( {
        x: VIEW_X_VALUES[ i ],
        children: [ bead ]
      } ) );
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

        const y0 = modelViewTransform.modelToViewY( model.nextLeftYProperty.value );

        beads[ 0 ].y = y0;
        stringShape.lineTo( VIEW_X_VALUES[ 0 ], y0 );
        for ( let i = 1; i < model.yDraw.length; i++ ) {
          const y = modelViewTransform.modelToViewY( model.yDraw[ i ] );

          beads[ i ].y = y;
          stringShape.lineTo( VIEW_X_VALUES[ i ], y );
        }
        stringShape.makeImmutable();
        stringPath.shape = stringShape;

        dirty = false;
      }
    } );
  }
}

waveOnAString.register( 'StringNode', StringNode );