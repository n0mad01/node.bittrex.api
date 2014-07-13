node.bittrex.api
=========

Node Bittrex API is an asynchronous node.js library for the Bittrex ( https://bittrex.com/ ) API.
The Bittrex API data can be received either as a GET request or a Stream.

Documentation to the Bittrex API: https://bittrex.com/Home/Api

Installation
----

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
    'apikey' : APIKEY,
    'stream' : true,
    'verbose' : true
});
```

By default the returned data is an object, in order to get clear text you have to add the option 'cleartext':
```javascript
'cleartext' : true
```

now you can use the object right away.
example:

```javascript
bittrex.getmarketsummaries( function( data ) {

    for( var i in data.result ) {
        bittrex.getticker( { market : data.result[i].MarketName }, function( ticker ) {
            console.log( ticker );
        });
    }
});
```

Streams
--
To activate Streaming simply add to your options:
```javascript
'stream' : true
```

Streaming depends on the following npm packages:
- JSONStream
- event-stream

Other
--

Other libraries utilized:
- request
- q

Methods
----

Not all Bittrex API methods are implemented yet (and may never be), also some could have been forgotten in the documentation ( therefore i reccomend you to consult the code ).
> Nonetheless the method **sendCustomRequest** enables completely custom requests anyway.

##### sendCustomRequest
```javascript
var url = 'https://bittrex.com/api/v1/public/getticker?market=BTC-LTC';
bittrex.sendCustomRequest( url, function( data ) {
    console.log( data );
});
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
bittrex.getmarkethistory( { market : 'BTC-LTC', count : 3 }, function( data ) {
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
bittrex.getorderbook( { market : 'BTC-LTC', depth : 10, type : 'both' }, function( data ) {
    console.log( data );
});
```

##### getwithdrawalhistory
```javascript
bittrex.getwithdrawalhistory( { currency : 'BTC', count : 1 }, function( data ) {
    console.log( data );
});
```

##### getdepositaddress
```javascript
bittrex.getdepositaddress( { currency : 'BTC' }, function( data ) {
    console.log( data );
});
```

##### getbalance
```javascript
bittrex.getbalance( { currency : 'BTC' }, function( data ) {
    console.log( data );
});
```

##### donations are welcome! 
BTC: 
> 1N5T2VYACYKxK3UUDHhp7g69qtUmsDdAjZ

