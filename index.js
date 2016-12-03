'use strict';

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';
const CRITICAL = 'critical';

const levelToColourCode = Object.freeze({

    debug: 34,
    info: 92,
    warn: 93,
    error: 91,
    critical: 31
});

// setting the optional LOG_LEVELS environment variable:
let envLogLevels;

if( process.env.LOG_LEVELS ) {

    envLogLevels = Object.freeze( process.env.LOG_LEVELS.split( ' ' ) );
}
else {

    envLogLevels = null;
}

const logLevels = envLogLevels || Object.freeze( [ DEBUG, INFO, WARN, ERROR, CRITICAL ] );

// setting the optional ROOT_LOGGER_PATH environment variable:
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
    const defaultColour = '\x1b[0m';
    const pathColour = '\x1b[90m';

    const loggerMessage = `${ level }: ${ pathColour }${ path }:${ levelColour } ${ message }`;

    console.log( `${ levelColour }${ loggerMessage }${ defaultColour }` );
}


function logIfLevelEnabled( level, path, message ) {

    if( logLevels.indexOf( level ) >= 0 ) {

        log( level, path, message );
    }
}


function getLogger( path ) {

    const logger = Object.freeze({

        debug( message ) {

            logIfLevelEnabled( DEBUG, path, message );
        },

        info( message ) {

            logIfLevelEnabled( INFO, path, message );
        },

        warn( message ) {

            logIfLevelEnabled( WARN, path, message );
        },

        error( message ) {

            logIfLevelEnabled( ERROR, path, message );
        },

        critical( message ) {

            logIfLevelEnabled( CRITICAL, path, message );
        }
    });

    return logger;
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
