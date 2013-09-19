// Copyright 2002-2013, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Wave on a String' sim.
 * Paths are relative to the location of this file.
 *
 * @author Anton Ulyanov (Mlearner)
 */

require.config( {

  deps: ['wave-on-a-string-main'],

  config: {
    i18n: {
      locale: 'en_us'
    }
  },

  paths: {

    // third-party libs
    i18n: '../../sherpa/i18n-2.0.4',

    // PhET libs, uppercase names to identify them in require.js imports
    ASSERT: '../../assert/js',
    AXON: '../../axon/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    NITROGLYCERIN: '../../nitroglycerin/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SUN: '../../sun/js',
    // contrib dependencies required by common directories
    stats: '../../phetcommon/contrib/stats-r11'
  },
  // Configure the dependencies and exports for older, traditional 'browser globals' scripts
  // that do not use define() to declare the dependencies and set a module value.
  shim: {
    stats: {
      exports: 'Stats'
    }
  },
  urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts
} );
