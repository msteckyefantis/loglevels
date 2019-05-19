'use strict';

const levelToColourCode = Object.freeze({

    debug: 34,
    info: 92,
    warn: 93,
    error: 91,
    critical: 31
});

const pathColour = '\x1b[90m';

const defaultColour = '\x1b[0m';

const STRING = 'string';

const pathAndComponentLengthLimit = 2083;

const missingPathAndOrComponentMessage = 'LogLevels Error: no path and/or component';

const nonStringPathAndOrComponentMessage = 'LogLevels Error: path and/or component are not strings';

const tooLongPathAndOrComponentMessage = 'LogLevels Error: path and/or component are too long ' +
    `(max length for either is ${ pathAndComponentLengthLimit } characters)`;

const allLogLevels = Object.freeze( Object.keys( levelToColourCode ) );

// getting the optional LOG_LEVELS_ON_FOR_COMPONENTS environment variable if it's defined:
let envLogLevelsOnForComponents = process.env.LOG_LEVELS_ON_FOR_COMPONENTS;

if( envLogLevelsOnForComponents ) {

    envLogLevelsOnForComponents = Object.freeze( envLogLevelsOnForComponents.split( ' ' ) );
}

const componentsLogLevelsIsOnFor = envLogLevelsOnForComponents || Object.freeze( [] );

// getting the optional LOG_LEVELS environment variable if it's defined:
let envLogLevels = process.env.LOG_LEVELS;

if( envLogLevels ) {

    envLogLevels = Object.freeze( envLogLevels.split( ' ' ) );
}

const logLevels = envLogLevels || allLogLevels;

// getting the optional ROOT_LOGGER_PATH environment variable if it's defined:
let envRootLoggerPath = process.env.ROOT_LOGGER_PATH;

if( envRootLoggerPath ) {

    envRootLoggerPath = `${ envRootLoggerPath }/`;
}

const relativePathIdentifier = envRootLoggerPath;

// getting the optional LOGGER_COLOUR_OFF environment variable if it's defined:
const colourIsOff = !!process.env.LOGGER_COLOUR_OFF;


const log = Object.freeze(

    ( level, path, ...message ) => {
    
        const messageToLog = [ ...message ].join( ' ' )

        if( colourIsOff ) {

            return console.log(
                `${ level }: ${ path }: ${ messageToLog }`
            );
        }

        const colourCode = levelToColourCode[ level ];

        const levelColour = `\x1b[${ colourCode }m`;

        const loggerMessage = `${ level }: ${ pathColour }${ path }:${ levelColour } ${ messageToLog }`;

        console.log( `${ levelColour }${ loggerMessage }${ defaultColour }` );
    }
);


const logIfOnAndLevelIsEnabled = Object.freeze(

    ( level, path, component, ...message  ) => {

        const logLevelsIsOnForComponent = componentsLogLevelsIsOnFor.includes( component );

        if( logLevelsIsOnForComponent ) {

            const levelIsEnabled = logLevels.includes( level );

            if( levelIsEnabled ) {

                log( level, path, ...message );
            }
        }
    }
);


const getLogger = Object.freeze(

    ( path, component ) => {

        const logger = {};

        allLogLevels.forEach( logLevel => {

            logger[ logLevel ] = ( ...message ) => {

                logIfOnAndLevelIsEnabled( logLevel, path, component, ...message );
            }
        });

        return Object.freeze( logger );
    }
);


const getRealitivePath = Object.freeze(

    path => {

        const lastIndexOfIdentifierInPath = path.lastIndexOf( relativePathIdentifier );

        const identifierIsInPath = (lastIndexOfIdentifierInPath >= 0);

        if( identifierIsInPath ) {

            const relativePath = path.substring(

                lastIndexOfIdentifierInPath +
                relativePathIdentifier.length
            );

            return relativePath;
        }

        return path;
    }
);


const validatePathAndComponent = Object.freeze(

    ( path, component ) => {

        if( !path || !component ) {

            throw Object.freeze( new Error( missingPathAndOrComponentMessage ) );
        }

        if( (typeof path !== STRING) || (typeof component !== STRING) ) {

            throw Object.freeze( new Error( nonStringPathAndOrComponentMessage ) );
        }

        if( (path.length > pathAndComponentLengthLimit) ||
            (component.length > pathAndComponentLengthLimit) ) {

            throw Object.freeze( new Error( tooLongPathAndOrComponentMessage ) );
        }
    }
);


module.exports = Object.freeze({

    setLocationAndGetLogger( path, component ) {

        validatePathAndComponent( path, component );

        const relativePath = getRealitivePath( path );

        return getLogger( relativePath, component );
    }
});
