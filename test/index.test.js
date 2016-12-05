'use strict';
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

    let logger;

    let consoleLogStub;

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

            beforeEach( function() {

                consoleLogStub = sinon.stub( console, 'log' );
            });

            afterEach( function() {

                freshy.unload( FULL_MODULE_PATH );

                delete process.env.LOG_LEVELS;
                delete process.env.ROOT_LOGGER_PATH;
                delete process.env.LOGGER_COLOUR_OFF;
            });

            it( 'logging: env log levels and root path, message is logged', function() {

                process.env.LOG_LEVELS = "debug info warn error critical";

                process.env.ROOT_LOGGER_PATH = controlRootPath;

                logger = require( FULL_MODULE_PATH ).setPathAndGetLogger( controlFileName );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colourCode }m${ levelData.level }: \u001b[90md/e/f.js:\u001b[${ levelData.colourCode }m mega monkey\u001b[0m` );
            });

            it( 'logging: default log levels and no root path, message is logged', function() {

                logger = require( FULL_MODULE_PATH ).setPathAndGetLogger( '/a/b/c.js' );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colourCode }m${ levelData.level }: \u001b[90m/a/b/c.js:\u001b[${ levelData.colourCode }m mega monkey\u001b[0m` );

            });

            it( 'logging: env log levels and no root path, message is not logged', function() {

                process.env.LOG_LEVELS = "fake_level";

                logger = require( FULL_MODULE_PATH ).setPathAndGetLogger( controlFileName );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 0 );
            });

            it( 'logging: default log levels and no root path, process.env.LOGGER_COLOUR_OFF is set to "true", message is logged', function() {

                process.env.LOGGER_COLOUR_OFF = 'true';

                logger = require( FULL_MODULE_PATH ).setPathAndGetLogger( controlFileName );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `${ levelData.level }: ${ controlFileName }: ${ controlMessage }` );
            });
        });
    });
});
