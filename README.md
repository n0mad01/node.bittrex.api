Node Bittrex API
=========

Node Bittrex API is an asynchronous node.js library for the Bittrex API - https://bittrex.com/.
The Bittrex API data can be received either as a GET request or a Stream.

Documentation to the Bittrex API: https://bittrex.com/Home/Api

Installation
----
install it most convenient via npm:
```sh
$ npm install node.bittrex.api
```

##### or

fetch the project via git:
```sh
$ git clone https://github.com/n0mad01/node.bittrex.api.git
```
then meet the package dependencies:
```sh
$ cd node-bittrex-api/
$ npm install
```

First steps
----

include node.bittrex.api.js into your project:
```javascript
var bittrex = require('./node.bittrex.api.js');
```

##### configure
```javascript
bittrex.options({
    'apikey' : API_KEY,
    'apisecret' : API_SECRET, 
    'stream' : true,
    'verbose' : true,
    'cleartext' : false 
});
```

By default the returned data is an object, in order to get clear text you have to add the option **cleartext** (streams will always return objects):
```javascript
'cleartext' : true
```

The baseUrl itself can also be set via options
```javascript
'baseUrl' : 'https://bittrex.com/api/v1'
```

After configuration you can use the object right away:
example #1
```javascript
bittrex.getmarketsummaries( function( data ) {
    for( var i in data.result ) {
        bittrex.getticker( { market : data.result[i].MarketName }, function( ticker ) {
            console.log( ticker );
        });
    }
});
```
example #2
```javascript
bittrex.getbalance({ currency : 'BTC' }, function( data ) {
    console.log( data );
});
```


Streams
--
To activate Streaming simply add to your options:
```javascript
'stream' : true
```

Streaming depends on the following npm packages:
- JSONStream https://www.npmjs.org/package/JSONStream
- event-stream https://www.npmjs.org/package/event-stream

Other
--

Other libraries utilized:
- request https://www.npmjs.org/package/request
- q https://www.npmjs.org/package/q

For HmacSHA512 this package is using a part of Crypto.js from google because the node crpyt package could not provide any appropriate result.
- http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha512.js

Methods
----

Optional parameters may have to be looked up at https://bittrex.com/Home/Api.

Not all Bittrex API methods are implemented yet (and may never be), also some could have been forgotten in the documentation ( therefore i recomend you to consult the class code ).
> Nonetheless the method **sendCustomRequest** enables completely custom requests anyway.

##### sendCustomRequest 
- url           String
- callback      Function
- credentials   Boolean     optional    whether the credentials should be added to the url or not, default is set to false.
example #1
```javascript
var url = 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC';
bittrex.sendCustomRequest( uri, function( data ) {
    console.log( data );
});
```

example #2 (credentials added to request/stream)
```javascript
bittrex.sendCustomRequest( 'https://bittrex.com/api/v1.1/account/getbalances?currency=BTC', function( data ) {
    console.log( data );
}, true );
```

##### getticker
```javascript
bittrex.getticker( { market : 'BTC-LTC' }, function( data ) {
    console.log( data );
});
```

##### getbalances
```javascript
bittrex.getbalances( function( data ) {
    console.log( data );
});
```

##### getmarkethistory
```javascript
bittrex.getmarkethistory({ market : 'BTC-LTC', count : 3 }, function( data ) {
    console.log( data );
});
```

##### getmarketsummaries
```javascript
bittrex.getmarketsummaries( function( data ) {
    console.log( data );
});
```

##### getorderbook
```javascript
bittrex.getorderbook({ market : 'BTC-LTC', depth : 10, type : 'both' }, function( data ) {
    console.log( data );
});
```

##### getwithdrawalhistory
```javascript
bittrex.getwithdrawalhistory({ currency : 'BTC', count : 1 }, function( data ) {
    console.log( data );
});
```

##### getdepositaddress
```javascript
bittrex.getdepositaddress({ currency : 'BTC' }, function( data ) {
    console.log( data );
});
```

##### getbalance
```javascript
bittrex.getbalance({ currency : 'BTC' }, function( data ) {
    console.log( data );
});
```

##### donations very welcome! 
> BTC
```bash
1N5T2VYACYKxK3UUDHhp7g69qtUmsDdAjZ
```

