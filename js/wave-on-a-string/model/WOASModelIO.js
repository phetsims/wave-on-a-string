// Copyright 2020, University of Colorado Boulder

/**
 * IO Type for the main model, including the typed array information.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf
 */

import validate from '../../../../axon/js/validate.js';
import Float64ArrayIO from '../../../../tandem/js/types/Float64ArrayIO.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import waveOnAString from '../../waveOnAString.js';

class WOASModelIO extends ObjectIO {

  /**
   * Serializes an instance.
   * @public
   * @override
   *
   * @param {WOASModel} model
   * @returns {{yDraw:Array.<number>,yNow:Array.<number>,yLast:Array.<number>,yNext:Array.<number>}}
   */
  static toStateObject( model ) {
    validate( model, this.validator );

    return {
      private: {
        yDraw: Float64ArrayIO.toStateObject( model.yDraw ),
        yNow: Float64ArrayIO.toStateObject( model.yNow ),
        yLast: Float64ArrayIO.toStateObject( model.yLast ),
        yNext: Float64ArrayIO.toStateObject( model.yNext )
      }
    };
  }

  /**
   * Set the position of the model.  This method is automatically called by phetioEngine.js when setting the state.
   * @public
   * @override
   *
   * @param {WOASModel} model
   * @param {Object} stateObject
   */
  static applyState( model, stateObject ) {
    validate( model, this.validator );

    // We make an assumption about Float64ArrayIO's serialization here, so that we don't create temporary garbage
    // Float64Arrays. Instead we set the array values directly.
    model.yDraw.set( stateObject.private.yDraw );
    model.yNow.set( stateObject.private.yNow );
    model.yLast.set( stateObject.private.yLast );
    model.yNext.set( stateObject.private.yNext );

    model.yNowChangedEmitter.emit();
  }
}

WOASModelIO.documentation = 'The main model for Wave on a String';
WOASModelIO.validator = { isValidValue: v => v instanceof phet.waveOnAString.WOASModel };
WOASModelIO.typeName = 'WOASModelIO';
ObjectIO.validateSubtype( WOASModelIO );

waveOnAString.register( 'WOASModelIO', WOASModelIO );
export default WOASModelIO;