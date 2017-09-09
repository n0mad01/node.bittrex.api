Node Bittrex API
=========

Node Bittrex API is an asynchronous node.js library for the Bittrex API - https://bittrex.com/.
The Bittrex API data can be received either as a GET request or via Websockets API (the Stream option will no longer be maintained and will be removed in further releases - please switch to Websockets if you want to use real Streams).

Documentation to the Bittrex API: https://bittrex.com/Home/Api

This Library was created by  [Adrian Soluch (@n0mad01)](https://github.com/n0mad01/) [soluch.us](http://soluch.us) and is licensed under the [MIT license](https://github.com/n0mad01/node.bittrex.api/blob/master/LICENSE).

Contributors
----
Thanks go to the people who have contributed code to this Library.

* [dparlevliet](https://github.com/dparlevliet) Special kudos - thanks to him i was able to add the Websocket API, also did he added the error object/handling param and the getcandles method for the Bittrex API V2
* [samuelhei](https://github.com/samuelhei) Special kudos - thanks to him all missing calls are complemented as also structural improvements have been made.
* [mhuggins](https://github.com/mhuggins)
* [192-sean](https://github.com/192-sean)
* [caffeinewriter](https://github.com/caffeinewriter)
* [apense](https://github.com/apense)

Before you start
----
This is just a quick reminder that you are handling coins with this library (and thus real money), so, understand the situation as much as possible and make everything to prevent losing them.

Here is a small checklist you should go through before you start:

1. Make sure you don't give your api key more rights as absolutely necessary - for first testing READ INFO alone should be enough! (bittrex.com under: Settings/API Keys)
![bittrex_ap_keys_control](https://user-images.githubusercontent.com/260321/29748739-a6c2c00e-8b1c-11e7-95ec-1b0221348235.png)
2. make sure to understand the API Key permissions
    1. READ INFO - Allows you to read private details such as open orders, order history, balances, etc
    2. TRADE LIMIT - Allows you to create/cancel trade limit buy/sell orders
    3. TRADE MARKET - allows you to create/cancel market buy/sell orders
    4. WITHDRAW - Allows you to withdraw to another address
3. Make use of the Bittrex IP Whitelist as also the Withdrawal Whitelist features
4. Do not ever commit your API Keys to GitHub or expose them under any circumstances!

Quick start
----
```sh
$ npm install node.bittrex.api
```

```javascript
var bittrex = require('node.bittrex.api');
bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET, 
});
bittrex.getmarketsummaries( function( data, err ) {
  if (err) {
    return console.error(err);
  }
  for( var i in data.result ) {
    bittrex.getticker( { market : data.result[i].MarketName }, function( ticker ) {
      console.log( ticker );
    });
  }
});
```


Advanced start
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

include node.bittrex.api.js into your project:
```javascript
var bittrex = require('./node.bittrex.api.js');
```

##### configure
```javascript
bittrex.options({
  'apikey' : API_KEY,
  'apisecret' : API_SECRET, 
  'stream' : true, // will be removed from future versions
  'verbose' : true,
  'cleartext' : false 
});
```

By default the returned data is an object, in order to get clear text you have to add the option **cleartext** (streams will always return text):
```javascript
'cleartext' : true
```

The baseUrl itself can also be set via options
```javascript
'baseUrl' : 'https://bittrex.com/api/v1',
'baseUrlv2' : 'https://bittrex.com/Api/v2.0',
```

Change the callbacks arguments sequence
```javascript
'inverse_callback_arguments' : true,
```
This simply changes the sequence in which the arguments are passed, instead of e.g.:
```javascript
getmarkethistory({market : 'USDT-BTC'}, function(data, error) {});
```
you'll get the reversed order:
```javascript
getmarkethistory({market : 'USDT-BTC'}, function(error, data) {});
```

Websockets
--
following methods are implemented:
> websockets.listen, websockets.subscribe

listen example
```javascript
var websocketsclient = bittrex.websockets.listen( function( data ) {
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
      });
    });
  }
});
```

subscribe example
```javascript
var websocketsclient = bittrex.websockets.subscribe(['BTC-ETH','BTC-SC','BTC-ZEN'], function(data) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  }
});
```

simple client & redefine serviceHandlers example
```javascript
var websocketsclient = bittrex.websockets.client();

websocketsclient.serviceHandlers.reconnecting = function (message) {
  return true; // set to true stops reconnect/retrying
}

websocketsclient.serviceHandlers.messageReceived = function (message) {
  console.log(message); // the messages received must be parsed as json first e.g. via jsonic(message.utf8Data)
}
```

all possible serviceHandlers
```javascript
bound: function() { console.log("Websocket bound"); },
connectFailed: function(error) { console.log("Websocket connectFailed: ", error); },
connected: function(connection) { console.log("Websocket connected"); },
disconnected: function() { console.log("Websocket disconnected"); },
onerror: function (error) { console.log("Websocket onerror: ", error); },
messageReceived: function (message) { console.log("Websocket messageReceived: ", message); return false; },
bindingError: function (error) { console.log("Websocket bindingError: ", error); },
connectionLost: function (error) { console.log("Connection Lost: ", error); },
reconnecting: function (retry { inital: true/false, count: 0} ) {
  console.log("Websocket Retrying: ", retry);
  //return retry.count >= 3; // cancel retry true
  return true;
}
```


Streams - please notice that streams will be removed from future versions
--
To activate Streaming simply add to your options:
```javascript
'stream' : true
```


Examples
--
After configuration you can use the object right away:
example #1
```javascript
bittrex.getmarketsummaries( function( data, err ) {
  if (err) {
    return console.error(err);
  }
  for( var i in data.result ) {
    bittrex.getticker( { market : data.result[i].MarketName }, function( ticker ) {
      console.log( ticker );
    });
  }
});
```

example #2
```javascript
bittrex.getbalance({ currency : 'BTC' }, function( data, err ) {
  if (err) {
    return console.error(err);
  }
  console.log( data );
});
```


Libraries
--

Websockets depends on the following npm packages:
- signalR websockets client https://www.npmjs.com/package/signalrjs
- jsonic JSON parser https://www.npmjs.com/package/jsonic

Streaming depends on the following npm packages (will be removed in future versions):
- JSONStream https://www.npmjs.org/package/JSONStream
- event-stream https://www.npmjs.org/package/event-stream

Other libraries utilized:
- request https://www.npmjs.org/package/request

For HmacSHA512 this package is using a part of Googles Crypto.js (the node crypt package could not provide any appropriate result).
- http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha512.js


Error examples
---

Example of request/domain based errors (not Bittrex API error)
```javascript
var url = 'http://fake.bittrex.com/api/v1.1/public/getticker?market=USDT-BTCXXX';
bittrex.sendCustomRequest( url, function( data, err ) {
  if (err) {
    /**
      { 
        success: false,
        message: 'URL request error',
        error: 
         { Error: getaddrinfo ENOTFOUND fake.bittrex.com fake.bittrex.com:80
             at errnoException (dns.js:28:10)
             at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:76:26)
           code: 'ENOTFOUND',
           errno: 'ENOTFOUND',
           syscall: 'getaddrinfo',
           hostname: 'fake.bittrex.com',
           host: 'fake.bittrex.com',
           port: 80 },
        result: undefined
      }
    */
    return console.error(err);
  }
  console.log(data);
});
```

Example of request/url based errors (not Bittrex API error)
```javascript
var url = 'http://bittrex.com/api/v1.1/public/getfakeendpoint';
bittrex.sendCustomRequest( url, function( data, err ) {
  if (err) {
    /**
      { 
        success: false,
        message: 'URL request error',
        error: undefined,
        result: {
          statusCode: 404,
          statusMessage: 'Not Found',
          body: '<!DOCTYPE html>\r\n<html > ...'
        }
      }
    */
    return console.error(err);
  }
  console.log(data);
});
```

Example of Bittrex API error
```javascript
bittrex.getcandles({
  marketName: 'USDT-BTC',
  tickInterval: 300
}, function(data, err) {
  if (err) {
    /**
      {
        success: false,
        message: 'INVALID_TICK_INTERVAL',
        result: null 
      }
    */
    return console.error(err);
  }
  console.log(data);
});
```


Methods
----

Optional parameters may have to be looked up at https://bittrex.com/Home/Api.

> It may happen that some Bittrex API methods are missing, also they could have been forgotten in the documentation. In this case, if this strikes you, feel free to open a issue or send me a pull request.

> Also: the method **sendCustomRequest** enables completely custom requests, regardless the specific API methods.

##### sendCustomRequest 
- url           String
- callback      Function
- credentials   Boolean     optional    whether the credentials should be applied to the request/stream or not, default is set to false.

example #1
```javascript
var url = 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC';
bittrex.sendCustomRequest( url, function( data, err ) {
  console.log( data );
});
```

example #2 (credentials applied to request/stream)
```javascript
bittrex.sendCustomRequest( 'https://bittrex.com/api/v1.1/account/getbalances?currency=BTC', function( data, err ) {
  console.log( data );
}, true );

will result in (the Header is being set too):
https://bittrex.com/api/v1.1/account/getbalances?currency=BTC&apikey=API_KEY&nonce=4456490600
```

##### getticker
```javascript
bittrex.getticker( { market : 'BTC-LTC' }, function( data, err ) {
  console.log( data );
});
```

##### getbalances
```javascript
bittrex.getbalances( function( data, err ) {
  console.log( data );
});
```

##### getmarkethistory
```javascript
bittrex.getmarkethistory({ market : 'BTC-LTC' }, function( data, err ) {
  console.log( data );
});
```

##### getcandles (v2 method)
```javascript
bittrex.getcandles({
  marketName: 'USDT-BTC',
  tickInterval: 'fiveMin', // intervals are keywords
}, function( data, err ) {
  console.log( data );
});
```

##### getmarketsummaries
```javascript
bittrex.getmarketsummaries( function( data, err ) {
  console.log( data );
});
```

##### getmarketsummary
```javascript
bittrex.getmarketsummary( { market : 'BTC-LTC'}, function( data, err ) {
  console.log( data );
});
```

##### getorderbook
```javascript
bittrex.getorderbook({ market : 'BTC-LTC', depth : 10, type : 'both' }, function( data, err ) {
  console.log( data );
});
```

##### getwithdrawalhistory
```javascript
bittrex.getwithdrawalhistory({ currency : 'BTC' }, function( data, err ) {
  console.log( data );
});
```

##### getdepositaddress
```javascript
bittrex.getdepositaddress({ currency : 'BTC' }, function( data, err ) {
  console.log( data );
});
```

##### getdeposithistory
```javascript
bittrex.getdeposithistory({ currency : 'BTC' }, function( data, err ) {
  console.log( data );
});
```

##### getbalance
```javascript
bittrex.getbalance({ currency : 'BTC' }, function( data, err ) {
  console.log( data );
});
```

##### withdraw
```javascript
bittrex.withdraw({ currency : 'BTC', quantity : '1.5112', address : 'THE_ADDRESS' }, function( data, err ) {
  console.log( data );
});
```


Testing
----

Installing test gear
```bash
npm install --only=dev
```

Running all tests
```bash
npm test tests
```

or individually
```bash
npm test tests/public.js
npm test tests/private.js
```

##### Testing private methods

Testing private method endpoints requires an api key/secret which should be 
installed in to ``tests/config.json`` - you will find an example file in 
``tests/config_example.json``.

```bash
cp tests/tests_example.json tests/config.json
vim tests/config.json
```


Donations welcome! 
---

BTC
> 17gtixgt4Q8hZcSictQwj5WUdgFjegCt36
