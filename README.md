# LogLevels [![npm version](https://badge.fury.io/js/loglevels.svg)](https://badge.fury.io/js/loglevels) [![Build Status](https://travis-ci.org/msteckyefantis/loglevels.svg?branch=master)](https://travis-ci.org/msteckyefantis/loglevels)

## About:
Sensual, single file, no dependency, colour logger. Just for you baby🐬.

## install:

```
npm install loglevels
```

## usage:

```.js
'use strict';

/* On-Switch (special environment variable): */
process.env.LOG_LEVELS_ON_FOR_COMPONENTS = 'component_a component_b component_c';

/* regular environment variables: */
// process.env.ROOT_LOGGER_PATH = 'music_app';
// process.env.LOG_LEVELS = 'debug warn critical';
// process.env.LOGGER_COLOUR_OFF = 'true';

const component = 'component_b';

const logger = require( 'loglevels' ).setLocationAndGetLogger( __filename, component );

logger.debug( 'your message here' );
logger.info( 'your message here' );
logger.warn( 'your message here' );
logger.error( 'your message here' );
logger.critical( 'sexy monkey' );
```

#### This code sample logs the following:
(`__filename` in this example is `'/Users/michaelstecky-efantis/music_app/loglevels/music_app/loglevelsTest.js'`)
![alt text](https://s3.amazonaws.com/mega-monkey/withoutenv.png)

#### With all the regular environment variables uncommented, the code sample above logs the following:
![alt text](https://s3.amazonaws.com/mega-monkey/withenv.png)