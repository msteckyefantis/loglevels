#LogLevels

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
// process.env.ROOT_LOGGER_PATH = "test";
// process.env.LOG_LEVELS = "debug warn critical";

const logger = require( 'loglevels' ).setDirectory( __filename );

logger.debug( 'your message here' )
logger.info( 'your message here' )
logger.warn( 'your message here' )
logger.error( 'your message here' )
logger.critical( 'sexy monkey' )

```

####This code sample logs the following:
(`__filename` in this example is `"/Users/User/epic__app/test/loggerTest/index.js"`)
[![full.png](https://s4.postimg.org/ouj6m9yz1/full.png)](https://postimg.org/image/sqwii9jyh/)


####with the (relative) root and log level environment variables uncommented, the code sample above logs the following:
[![partial.png](https://s12.postimg.org/o3kp7pikd/partial.png)](https://postimg.org/image/mbrqcsz7d/)
