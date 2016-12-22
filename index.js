'use strict';

const subzero = require( 'subzero' );

const levelToColourCode = subzero.megaFreeze({

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

const allLogLevels = subzero.megaFreeze( Object.keys( levelToColourCode ) );

// getting the optional LOG_LEVELS_ON_FOR_COMPONENTS environment variable if it's defined:
let envLogLevelsOnForComponents = process.env.LOG_LEVELS_ON_FOR_COMPONENTS;

if( envLogLevelsOnForComponents ) {

    envLogLevelsOnForComponents = subzero.megaFreeze( envLogLevelsOnForComponents.split( ' ' ) );
}

const componentsLogLevelsIsOnFor = envLogLevelsOnForComponents || subzero.megaFreeze( [] );

// getting the optional LOG_LEVELS environment variable if it's defined:
let envLogLevels = process.env.LOG_LEVELS;

if( envLogLevels ) {

    envLogLevels = subzero.megaFreeze( envLogLevels.split( ' ' ) );
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


const log = subzero.megaFreeze( ( level, path, message ) => {

    if( colourIsOff ) {

        return console.log( `${ level }: ${ path }: ${ message }` );
    }

    const colourCode = levelToColourCode[ level ];

    const levelColour = `\x1b[${ colourCode }m`;

    const loggerMessage = `${ level }: ${ pathColour }${ path }:${ levelColour } ${ message }`;

    console.log( `${ levelColour }${ loggerMessage }${ defaultColour }` );
});


const logIfOnAndLevelIsEnabled = subzero.megaFreeze( ( level, path, message, component ) => {

    const logLevelsIsOnForComponent = (componentsLogLevelsIsOnFor.indexOf( component ) >= 0)

    if( logLevelsIsOnForComponent ) {

        const levelIsEnabled = (logLevels.indexOf( level ) >= 0);

        if( levelIsEnabled ) {

            log( level, path, message );
        }
    }
});


const getLogger = subzero.megaFreeze( ( path, component ) => {

    const logger = {};

    allLogLevels.forEach( logLevel => {

        logger[ logLevel ] = message => {

            logIfOnAndLevelIsEnabled( logLevel, path, message, component );
        }
    });

    return subzero.megaFreeze( logger );
});


const getRealitivePath = subzero.megaFreeze( path => {

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
});


const validatePathAndComponent = subzero.megaFreeze( ( path, component ) => {

    if( !path || !component ) {

        throw subzero.megaFreeze( new Error( missingPathAndOrComponentMessage ) );
    }

    if( (typeof path !== STRING) || (typeof component !== STRING) ) {

        throw subzero.megaFreeze( new Error( nonStringPathAndOrComponentMessage ) );
    }

    if( (path.length > pathAndComponentLengthLimit) ||
        (component.length > pathAndComponentLengthLimit) ) {

        throw subzero.megaFreeze( new Error( tooLongPathAndOrComponentMessage ) );
    }
});


module.exports = subzero.megaFreeze({

    setLocationAndGetLogger( path, component ) {

        validatePathAndComponent( path, component );

        const relativePath = getRealitivePath( path );

        return getLogger( relativePath, component );
    }
});
