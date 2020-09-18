// Copyright 2020, University of Colorado Boulder

/**
 * IO Type for the main model, including the typed array information.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf
 */

import Float64ArrayIO from '../../../../tandem/js/types/Float64ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import waveOnAString from '../../waveOnAString.js';

const WOASModelIO = new IOType( 'WOASModelIO', {
  isValidValue: v => v instanceof phet.waveOnAString.WOASModel,
  documentation: 'The main model for Wave on a String',
  toStateObject: model => ( {
    private: {
      yDraw: Float64ArrayIO.toStateObject( model.yDraw ),
      yNow: Float64ArrayIO.toStateObject( model.yNow ),
      yLast: Float64ArrayIO.toStateObject( model.yLast ),
      yNext: Float64ArrayIO.toStateObject( model.yNext )
    }
  } ),
  applyState: ( model, stateObject ) => {

    // We make an assumption about Float64ArrayIO's serialization here, so that we don't create temporary garbage
    // Float64Arrays. Instead we set the array values directly.
    model.yDraw.set( stateObject.private.yDraw );
    model.yNow.set( stateObject.private.yNow );
    model.yLast.set( stateObject.private.yLast );
    model.yNext.set( stateObject.private.yNext );

    model.yNowChangedEmitter.emit();
  }
} );

waveOnAString.register( 'WOASModelIO', WOASModelIO );
export default WOASModelIO;