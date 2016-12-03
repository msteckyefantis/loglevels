'use strict';

const levelToColourCode = Object.freeze({

    debug: 34,
    info: 92,
    warn: 93,
    error: 91,
    critical: 31
});

const levels = Object.freeze( Object.keys( levelToColourCode ) );

// getting the optional LOG_LEVELS environment variable if it's defined:
let envLogLevels;

if( process.env.LOG_LEVELS ) {

    envLogLevels = Object.freeze( process.env.LOG_LEVELS.split( ' ' ) );
}
else {

    envLogLevels = null;
}

const logLevels = envLogLevels || levels;

// getting the optional ROOT_LOGGER_PATH environment variable if it's defined:
let envRootLoggerPath;

if( process.env.ROOT_LOGGER_PATH ) {

    envRootLoggerPath = `${ process.env.ROOT_LOGGER_PATH }/`;
}
else {

    envRootLoggerPath = null;
}

const relativePathIndentifier = envRootLoggerPath;


function log( level, path, message ) {

    const colourCode = levelToColourCode[ level ];

    const levelColour = `\x1b[${ colourCode }m`;
    const pathColour = '\x1b[90m';
    const defaultColour = '\x1b[0m';

    const loggerMessage = `${ level }: ${ pathColour }${ path }:${ levelColour } ${ message }`;

    console.log( `${ levelColour }${ loggerMessage }${ defaultColour }` );
}


function logIfLevelEnabled( level, path, message ) {

    const levelIsEnabled = (logLevels.indexOf( level ) >= 0);

    if( levelIsEnabled ) {

        log( level, path, message );
    }
}


function getLogger( path ) {

    const logger = {};

    levels.forEach( function( level ) {

        logger[ level ] = function( message ) {

            logIfLevelEnabled( level, path, message );
        }
    });

    return Object.freeze( logger );
}


function getRealitivePath( path ) {

    if( relativePathIndentifier ) {

        const relativePath = path.substring(

            path.lastIndexOf( relativePathIndentifier ) +
            relativePathIndentifier.length
        );

        return relativePath;
    }

    return path;
}


module.exports = Object.freeze({

    setPathAndGetLogger( path ) {

        const relativePath = getRealitivePath( path );

        return getLogger( relativePath );
    }
});
