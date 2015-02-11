// Copyright 2002-2014, University of Colorado Boulder


/*
 * RequireJS configuration file for the 'Wave on a String' sim.
 * Paths are relative to the location of this file.
 *
 * @author Anton Ulyanov (Mlearner)
 */

require.config( {

  deps: [ 'wave-on-a-string-main' ],

  paths: {

    // third-party libs
    text: '../../sherpa/text',

    // PhET plugins
    image: '../../chipper/requirejs-plugins/image',
    audio: '../../chipper/requirejs-plugins/audio',
    string: '../../chipper/requirejs-plugins/string',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SUN: '../../sun/js',

    // this sim
    WAVE_ON_A_STRING: '.'
  },

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: phet.chipper.getCacheBusterArgs()
} );
