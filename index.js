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


function logger( level, colourCode, dir, message ) {

    let levelColor = `\x1b[${ colourCode }m`;
    let defaultColor = '\x1b[0m';
    let dirColor = '\x1b[90m';

    let loggerMessage = `${ level }: ${ dirColor }${ dir }:${ levelColor } ${ message }`;

    console.log( `${ levelColor }${ loggerMessage }${ defaultColor }` );
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

        return Object.freeze({

            debug( message ) {

                if( logLevels.indexOf( DEBUG ) >= 0 ) {

                    logger( DEBUG, 34, relativeDir, message );
                }
            },

            info( message ) {

                if( logLevels.indexOf( INFO ) >= 0 ) {

                    logger( INFO, 92, relativeDir, message );
                }
            },

            warn( message ) {

                if( logLevels.indexOf( WARN ) >= 0 ) {

                    logger( WARN, 93, relativeDir, message );
                }
            },

            error( message ) {

                if( logLevels.indexOf( ERROR ) >= 0 ) {

                    logger( ERROR, 91, relativeDir, message );
                }
            },

            critical( message ) {

                if( logLevels.indexOf( CRITICAL ) >= 0 ) {

                    logger( CRITICAL, 31, relativeDir, message );
                }
            }
        });
    }
});
