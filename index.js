'use strict';

const pathColour = '\x1b[90m';

const defaultColour = '\x1b[0m';

const levelToColourCode = Object.freeze({

    debug: 34,
    info: 92,
    warn: 93,
    error: 91,
    critical: 31
});

const allLogLevels = Object.freeze( Object.keys( levelToColourCode ) );

// getting the optional LOG_LEVELS_ON_FOR_PROJECTS environment variable if it's defined:
let envLogLevelsOnForProjects = process.env.LOG_LEVELS_ON_FOR_PROJECTS;

if( envLogLevelsOnForProjects ) {

    envLogLevelsOnForProjects = Object.freeze( envLogLevelsOnForProjects.split( ' ' ) );
}

const projectsLogLevelsIsOnFor = envLogLevelsOnForProjects || [];

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

const relativePathIndentifier = envRootLoggerPath;

// getting the optional LOGGER_COLOUR_OFF environment variable if it's defined:
const colourIsOff = !!process.env.LOGGER_COLOUR_OFF;


function log( level, path, message ) {

    if( colourIsOff ) {

        return console.log( `${ level }: ${ path }: ${ message }` );
    }

    const colourCode = levelToColourCode[ level ];

    const levelColour = `\x1b[${ colourCode }m`;

    const loggerMessage = `${ level }: ${ pathColour }${ path }:${ levelColour } ${ message }`;

    console.log( `${ levelColour }${ loggerMessage }${ defaultColour }` );
}


function logIfOnAndLevelIsEnabled( level, path, message, project ) {

    const logLevelsIsOnForProject = (projectsLogLevelsIsOnFor.indexOf( project ) >= 0)

    if( logLevelsIsOnForProject ) {

        const levelIsEnabled = (logLevels.indexOf( level ) >= 0);

        if( levelIsEnabled ) {

            log( level, path, message );
        }
    }
}


function getLogger( path, project ) {

    const logger = {};

    allLogLevels.forEach( function( logLevel ) {

        logger[ logLevel ] = function( message ) {

            logIfOnAndLevelIsEnabled( logLevel, path, message, project );
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

    setLocationAndGetLogger( path, project ) {

        const relativePath = getRealitivePath( path );

        return getLogger( relativePath, project );
    }
});
