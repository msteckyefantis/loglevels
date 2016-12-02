'use strict';

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';
const CRITICAL = 'critical';

let envLogLevels;

if( process.env.LOG_LEVELS ) {

    envLogLevels = process.env.LOG_LEVELS.split( ' ' );
}
else {

    envLogLevels = null;
}

const logLevels = envLogLevels || [ DEBUG, INFO, WARN, ERROR, CRITICAL ];

let envRootLoggerPath;

if( process.env.ROOT_LOGGER_PATH ) {

    envRootLoggerPath = `${ process.env.ROOT_LOGGER_PATH }/`;
}
else {

    envRootLoggerPath = null;
}

const relativeDirIndentifier = envRootLoggerPath;


function log( level, colourCode, dir, message ) {

    let levelColor = `\x1b[${ colourCode }m`;
    let defaultColor = '\x1b[0m';
    let dirColor = '\x1b[90m';

    let loggerMessage = `${ level }: ${ dirColor }${ dir }:${ levelColor } ${ message }`;

    console.log( `${ levelColor }${ loggerMessage }${ defaultColor }` );
}


function getLogger( dir ) {

    return Object.freeze({

        debug( message ) {

            if( logLevels.indexOf( DEBUG ) >= 0 ) {

                log( DEBUG, 34, dir, message );
            }
        },

        info( message ) {

            if( logLevels.indexOf( INFO ) >= 0 ) {

                log( INFO, 92, dir, message );
            }
        },

        warn( message ) {

            if( logLevels.indexOf( WARN ) >= 0 ) {

                log( WARN, 93, dir, message );
            }
        },

        error( message ) {

            if( logLevels.indexOf( ERROR ) >= 0 ) {

                log( ERROR, 91, dir, message );
            }
        },

        critical( message ) {

            if( logLevels.indexOf( CRITICAL ) >= 0 ) {

                log( CRITICAL, 31, dir, message );
            }
        }
    });
}


function getRealitiveDir( dir ) {

    if( relativeDirIndentifier ) {

        return dir.substring( dir.lastIndexOf( relativeDirIndentifier ) + relativeDirIndentifier.length );
    }

    return dir;
}


module.exports = Object.freeze({

    setDirectory( dir ) {

        let relativeDir = getRealitiveDir( dir );

        return getLogger( relativeDir );
    }
});
