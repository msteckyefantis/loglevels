#LogLevels [![npm version](https://badge.fury.io/js/loglevels.svg)](https://badge.fury.io/js/loglevels)

##About:
Sensual, single file, no dependency, colour logger. Just for you baby🐬.

##install:

```
npm install loglevels
```

##usage:

```.js
'use strict';

/* root and log level environment variables: */
// process.env.ROOT_LOGGER_PATH = 'test';
// process.env.LOG_LEVELS = 'debug warn critical';

const logger = require( 'loglevels' ).setPathAndGetLogger( __filename );

logger.debug( 'your message here' );
logger.info( 'your message here' );
logger.warn( 'your message here' );
logger.error( 'your message here' );
logger.critical( 'sexy monkey' );

```

####This code sample logs the following:
(`__filename` in this example is `'/user/dir_a/test/dir_b/test/dir_c/index.js'`)
[![full_2.png](https://s16.postimg.org/hdkmd3205/full_2.png)](https://postimg.org/image/ejhgzmztt/)


####with the (relative) root and log level environment variables uncommented, the code sample above logs the following:
[![partial_2.png](https://s17.postimg.org/a0rnmxubj/partial_2.png)](https://postimg.org/image/nug0bzmwr/)
