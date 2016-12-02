'use strict';
/* jshint -W100 */

const expect = require( 'chai' ).expect;

const sinon = require( 'sinon' );

const freshy = require( 'freshy' )


describe( 'index.js', function() {

    const controlMessage = 'mega monkey';

    const controlFileName = '/a/b/c/d/e/f.js';

    const controlRootPath = '/b/c';

    let logger;

    let consoleLogStub;

    [
        {
            level: 'debug',
            colorCode: 34
        },

        {
            level: 'info',
            colorCode: 92
        },

        {
            level: 'warn',
            colorCode: 93
        },

        {
            level: 'error',
            colorCode: 91
        },

        {
            level: 'critical',
            colorCode: 31
        }

    ].forEach( function( levelData ) {

        describe( `logger.${ levelData.level }`, function() {

            beforeEach( function() {

                consoleLogStub = sinon.stub( console, 'log' );
            });

            afterEach( function() {

                freshy.unload( '../index.js' );

                delete process.env.LOG_LEVELS;
                delete process.env.ROOT_LOGGER_PATH;
            });

            it( 'logging: env log levels and root path, message is logged', function() {

                process.env.LOG_LEVELS = "debug info warn error critical";

                process.env.ROOT_LOGGER_PATH = controlRootPath;

                logger = require( '../index.js' ).setPathAndGetLogger( controlFileName );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colorCode }m${ levelData.level }: \u001b[90md/e/f.js:\u001b[${ levelData.colorCode }m mega monkey\u001b[0m` );
            });

            it( 'logging: default log levels and no root path, message is logged', function() {

                logger = require( '../index.js' ).setPathAndGetLogger( '/a/b/c.js' );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 1 );
                expect( consoleLogStub.args[0].length ).equal( 1 );
                expect( consoleLogStub.args[0][0] )
                    .equal( `\u001b[${ levelData.colorCode }m${ levelData.level }: \u001b[90m/a/b/c.js:\u001b[${ levelData.colorCode }m mega monkey\u001b[0m` );

            });

            it( 'logging: env log levels and no root path, message is not logged', function() {

                process.env.LOG_LEVELS = "fake_level";

                logger = require( '../index.js' ).setPathAndGetLogger( controlFileName );

                logger[ levelData.level ]( controlMessage );

                consoleLogStub.restore();

                expect( consoleLogStub.args.length ).equal( 0 );
            });
        });
    });
});
