'use strict';

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';
const CRITICAL = 'critical';

let envLogLevels;

if( process.env.LOG_LEVELS ) {

    envLogLevels = Object.freeze( process.env.LOG_LEVELS.split( ' ' ) );
}
else {

    envLogLevels = null;
}

const logLevels = envLogLevels || Object.freeze( [ DEBUG, INFO, WARN, ERROR, CRITICAL ] );

let envRootLoggerPath;

if( process.env.ROOT_LOGGER_PATH ) {

    envRootLoggerPath = `${ process.env.ROOT_LOGGER_PATH }/`;
}
else {

    envRootLoggerPath = null;
}

const relativePathIndentifier = envRootLoggerPath;


function log( level, colourCode, path, message ) {

    let levelColor = `\x1b[${ colourCode }m`;
    let defaultColor = '\x1b[0m';
    let dirColor = '\x1b[90m';

    let loggerMessage = `${ level }: ${ dirColor }${ path }:${ levelColor } ${ message }`;

    console.log( `${ levelColor }${ loggerMessage }${ defaultColor }` );
}


function getLogger( path ) {

    const logger = Object.freeze({

        debug( message ) {

            if( logLevels.indexOf( DEBUG ) >= 0 ) {

                log( DEBUG, 34, path, message );
            }
        },

        info( message ) {

            if( logLevels.indexOf( INFO ) >= 0 ) {

                log( INFO, 92, path, message );
            }
        },

        warn( message ) {

            if( logLevels.indexOf( WARN ) >= 0 ) {

                log( WARN, 93, path, message );
            }
        },

        error( message ) {

            if( logLevels.indexOf( ERROR ) >= 0 ) {

                log( ERROR, 91, path, message );
            }
        },

        critical( message ) {

            if( logLevels.indexOf( CRITICAL ) >= 0 ) {

                log( CRITICAL, 31, path, message );
            }
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

        let relativePath = getRealitivePath( path );

        return getLogger( relativePath );
    }
});
