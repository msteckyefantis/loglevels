#LogLevels [![npm version](https://badge.fury.io/js/loglevels.svg)](https://badge.fury.io/js/loglevels) [![Build Status](https://travis-ci.org/msteckyefantis/loglevels.svg?branch=master)](https://travis-ci.org/msteckyefantis/loglevels)

##About:
Sensual, single file, no dependency, colour logger. Just for you baby🐬.

##install:

```
npm install loglevels
```

##usage:

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

####This code sample logs the following:
(`__filename` in this example is `'/user/dir_a/test_dir/dir_b/test_dir/dir_c/index.js'`)
[![full2_1.png](https://s13.postimg.org/odhg3yb07/full2_1.png)](https://postimg.org/image/ynjv370vn/)


####with all the regular environment variables uncommented, the code sample above logs the following:
[![partial2_1.png](https://s18.postimg.org/b6t2tc3o9/partial2_1.png)](https://postimg.org/image/7n753j0yd/)
