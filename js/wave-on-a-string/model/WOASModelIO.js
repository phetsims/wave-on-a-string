// Copyright 2020, University of Colorado Boulder

/**
 * IO type for the main model, including the typed array information.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf
 */
define( require => {
  'use strict';

  // modules
  const Float64ArrayIO = require( 'TANDEM/types/Float64ArrayIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const validate = require( 'AXON/validate' );
  const waveOnAString = require( 'WAVE_ON_A_STRING/waveOnAString' );

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
        yDraw: Float64ArrayIO.toStateObject( model.yDraw ),
        yNow: Float64ArrayIO.toStateObject( model.yNow ),
        yLast: Float64ArrayIO.toStateObject( model.yLast ),
        yNext: Float64ArrayIO.toStateObject( model.yNext )
      };
    }

    /**
     * Set the position of the model using the value parsed in fromStateObject.  This method is automatically called by
     * phetioEngine.js when setting the state.
     * @public
     * @override
     *
     * @param {WOASModel} model
     * @param {{yDraw:Array.<number>,yNow:Array.<number>,yLast:Array.<number>,yNext:Array.<number>}} - stateObject
     */
    static setValue( model, stateObject ) {
      validate( model, this.validator );

      // We make an assumption about Float64ArrayIO's serialization here, so that we don't create temporary garbage
      // Float64Arrays. Instead we set the array values directly.
      model.yDraw.set( stateObject.yDraw );
      model.yNow.set( stateObject.yNow );
      model.yLast.set( stateObject.yLast );
      model.yNext.set( stateObject.yNext );

      model.yNowChangedEmitter.emit();
    }
  }

  WOASModelIO.documentation = 'The main model for Wave on a String';
  WOASModelIO.validator = { isValidValue: v => v instanceof phet.waveOnAString.WOASModel };
  ObjectIO.validateSubtype( WOASModelIO );

  return waveOnAString.register( 'WOASModelIO', WOASModelIO );
} );
