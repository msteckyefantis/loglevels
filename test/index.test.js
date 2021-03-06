'use strict';
/* jshint expr: true */
/* jshint -W100 */

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );

const freshy = require( 'freshy' )

const ROOT_PATH = '../';

const MODULE_PATH = 'index.js';

const FULL_MODULE_PATH = ROOT_PATH + MODULE_PATH;


describe( MODULE_PATH, function() {

    const controlMessage = 'mega monkey';

    const controlFileName = '/a/b/c/d/e/f.js';

    const controlRootPath = '/b/c';

    const controlComponentA = 'component_a';

    const controlComponentB = 'component_b';

    let longString = '';

    for( let i = 0; i < 3000; i++ ) {

        longString += 'a';
    }

    let logger;

    let consoleLogStub;

    beforeEach( function() {

        process.env.LOG_LEVELS_ON_FOR_COMPONENTS = `${ controlComponentA } ${ controlComponentB }`;
        consoleLogStub = sinon.stub( console, 'log' );
    });

    afterEach( function() {

        freshy.unload( FULL_MODULE_PATH );

        delete process.env.LOG_LEVELS;
        delete process.env.ROOT_LOGGER_PATH;
        delete process.env.LOGGER_COLOUR_OFF;
        delete process.env.LOG_LEVELS_ON_FOR_COMPONENTS;
    });

    describe( 'init', function() {

        it( 'init failure: no component provided', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: no path and/or component' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: no path or component provided', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger();
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: no path and/or component' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: no path provided', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( undefined, controlComponentA );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: no path and/or component' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: path is not a string', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( { xxx: 69 }, controlComponentA );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are not strings' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: component is not a string', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, { xxx: 69 } );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are not strings' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: path and component are not strings', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( { xxx: 69 }, { yyy: 69 } );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are not strings' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: path is too long', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( longString, controlComponentA );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are too long (max length for either is 2083 characters)' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: component is too long', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlMessage, longString );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are too long (max length for either is 2083 characters)' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });

        it( 'init failure: path and component are too long', function() {

            consoleLogStub.restore();

            let erroredAsExpected = false;

            try {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( longString, longString );
            }
            catch( error ) {

                if( error.message === 'LogLevels Error: path and/or component are too long (max length for either is 2083 characters)' ) {

                    erroredAsExpected = true;
                }
            }

            expect( consoleLogStub.args.length ).equal( 0 );

            expect( erroredAsExpected ).true;
        });
    });

    [
        {
            level: 'debug',
            colourCode: 34
        },

        {
            level: 'info',
            colourCode: 92
        },

        {
            level: 'warn',
            colourCode: 93
        },

        {
            level: 'error',
            colourCode: 91
        },

        {
            level: 'critical',
            colourCode: 31
        }

    ].forEach( function( levelData ) {

        describe( `logger.${ levelData.level }`, function() {

            it( 'logging: env log levels and root path, message is logged', function() {

                process.env.LOG_LEVELS = "debug info warn error critical";

                process.env.ROOT_LOGGER_PATH = controlRootPath;

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, controlComponentA );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colourCode }m${ levelData.level }: \u001b[90md/e/f.js:\u001b[${ levelData.colourCode }m mega monkey\u001b[0m` );
            });

            it( 'logging: default log levels and no root path, message is logged', function() {

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( '/a/b/c.js', controlComponentB );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colourCode }m${ levelData.level }: \u001b[90m/a/b/c.js:\u001b[${ levelData.colourCode }m mega monkey\u001b[0m` );

            });

            it( 'logging: env log levels and no root path, message is not logged', function() {

                process.env.LOG_LEVELS = "fake_level";

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, controlComponentA );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 0 );
            });

            it( 'logging: default log levels and no root path, process.env.LOGGER_COLOUR_OFF is set to "true", message is logged', function() {

                process.env.LOGGER_COLOUR_OFF = 'true';

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, controlComponentB );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `${ levelData.level }: ${ controlFileName }: ${ controlMessage }` );
            });

            it( 'logging: default log levels and no root path, log levels not on for any component, message is not logged', function() {

                delete process.env.LOG_LEVELS_ON_FOR_COMPONENTS;

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, controlComponentA );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 0 );
            });

            it( 'logging: env log levels and root path which is not in the path name, message is logged', function() {

                process.env.LOG_LEVELS = "debug info warn error critical";

                process.env.ROOT_LOGGER_PATH = 'xxx.js';

                logger = require( FULL_MODULE_PATH ).setLocationAndGetLogger( controlFileName, controlComponentA );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colourCode }m${ levelData.level }: \u001b[90m/a/b/c/d/e/f.js:\u001b[${ levelData.colourCode }m mega monkey\u001b[0m` );
            });
        });
    });
});
