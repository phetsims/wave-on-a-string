// Copyright 2017-2020, University of Colorado Boulder

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
  const VoidIO = require( 'TANDEM/types/VoidIO' );
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
     * @param {{yDraw:Array.<number>,yNow:Array.<number>,yLast:Array.<number>,yNext:Array.<number>}} - fromStateObject
     */
    static setValue( model, fromStateObject ) {
      validate( model, this.validator );

      Float64ArrayIO.setValue( model.yDraw, fromStateObject.yDraw );
      Float64ArrayIO.setValue( model.yNow, fromStateObject.yNow );
      Float64ArrayIO.setValue( model.yLast, fromStateObject.yLast );
      Float64ArrayIO.setValue( model.yNext, fromStateObject.yNext );

      model.yNowChangedEmitter.emit();
    }
  }

  WOASModelIO.methods = {
    setValue: {
      returnType: VoidIO,
      parameterTypes: [ ObjectIO ],
      implementation: function( value ) {
        // TODO: why are we duplicating setValue
        Float64ArrayIO.setValue( this.phetioObject.yDraw, value.yDraw );
        Float64ArrayIO.setValue( this.phetioObject.yNow, value.yNow );
        Float64ArrayIO.setValue( this.phetioObject.yLast, value.yLast );
        Float64ArrayIO.setValue( this.phetioObject.yNext, value.yNext );

        this.phetioObject.yNowChangedEmitter.emit();
      },
      documentation: 'Load the numeric string position values into the model',
      invocableForReadOnlyElements: false
    }
  };

  WOASModelIO.documentation = 'The main model for Wave on a String';
  WOASModelIO.validator = { isValidValue: v => v instanceof phet.waveOnAString.WOASModel };
  ObjectIO.validateSubtype( WOASModelIO );

  return waveOnAString.register( 'WOASModelIO', WOASModelIO );
} );
