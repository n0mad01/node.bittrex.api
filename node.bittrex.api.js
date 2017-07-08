/* ============================================================
 * node.bittrex.api
 * https://github.com/n0mad01/node.bittrex.api
 *
 * ============================================================
 * Copyright 2014-2017, Adrian Soluch - http://soluch.us/
 * Released under the MIT License
 * ============================================================ */
var NodeBittrexApi = function() {

  'use strict';

  var request = require('request'),
    hmac_sha512 = require('./hmac-sha512.js'),
    JSONStream = require('JSONStream'),
    es = require('event-stream'),
    jsonic = require('jsonic'),
    signalR = require('signalr-client'),
    wsclient;

  var start,
    request_options = {
      method: 'GET',
      agent: false,
      headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; Node Bittrex API)',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    };

  var opts = {
    baseUrl: 'https://bittrex.com/api/v1.1',
    websockets_baseurl: 'wss://socket.bittrex.com/signalr',
    websockets_hubs: ['CoreHub'],
    apikey: 'APIKEY',
    apisecret: 'APISECRET',
    verbose: false,
    cleartext: false,
    stream: false,
  };

  var getNonce = function() {
    return Math.floor(new Date().getTime() / 1000);
  };

  var extractOptions = function(options) {

    var o = Object.keys(options),
      i;
    for (i = 0; i < o.length; i++) {
      opts[o[i]] = options[o[i]];
    }
  };

  var apiCredentials = function(uri) {

    var options = {
      apikey: opts.apikey,
      nonce: getNonce()
    };

    return setRequestUriGetParams(uri, options);
  };

  var setRequestUriGetParams = function(uri, options) {

    var op;
    if (typeof(uri) === 'object') {
      op = uri;
      uri = op.uri;
    } else {
      op = request_options;
    }


    var o = Object.keys(options),
      i;
    for (i = 0; i < o.length; i++) {
      uri = updateQueryStringParameter(uri, o[i], options[o[i]]);
    }

    op.headers.apisign = hmac_sha512.HmacSHA512(uri, opts.apisecret); // setting the HMAC hash `apisign` http header
    op.uri = uri;

    return op;
  };

  var updateQueryStringParameter = function(uri, key, value) {

      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
      var separator = uri.indexOf('?') !== -1 ? "&" : "?";

      if (uri.match(re)) {
          uri = uri.replace(re, '$1' + key + "=" + value + '$2');
      } else {
          uri = uri + separator + key + "=" + value;
      }

      return uri;
  };

  var sendRequestCallback = function(callback, op) {

    start = Date.now();

    switch (opts.stream) {
      case true:
        request(op)
          .pipe(JSONStream.parse('*'))
          .pipe(es.mapSync(function(data) {
            callback(data);
            ((opts.verbose) ? console.log("streamed from " + op.uri + " in: %ds", (Date.now() - start) / 1000) : '');
          }));
        break;
      case false:
        request(op, function(error, result, body) {
          if (!body || !result || result.statusCode != 200) {
            callback({error : error, result : result});
          } else {
            callback(((opts.cleartext) ? body : JSON.parse(body)));
            ((opts.verbose) ? console.log("requested from " + result.request.href + " in: %ds", (Date.now() - start) / 1000) : '');
          }
        });
        break;
    }
  };

  var connectws = function(callback) {

    wsclient = new signalR.client(
      opts.websockets_baseurl,
      opts.websockets_hubs
    );
    wsclient.serviceHandlers = {
      bound: function() {
        ((opts.verbose) ? console.log('Websocket bound') : '');
      },
      connectFailed: function(error) {
        ((opts.verbose) ? console.log('Websocket connectFailed: ', error) : '');
      },
      disconnected: function() {
        ((opts.verbose) ? console.log('Websocket disconnected') : '');
      },
      onerror: function (error) {
        ((opts.verbose) ? console.log('Websocket onerror: ', error) : '');
      },
      bindingError: function (error) {
        ((opts.verbose) ? console.log('Websocket bindingError: ', error) : '');
      },
      connectionLost: function (error) {
        ((opts.verbose) ? console.log('Connection Lost: ', error) : '');
      },
      reconnecting: function (retry) {
        ((opts.verbose) ? console.log('Websocket Retrying: ', retry) : '');
        // change to true to stop retrying
        return false;
      }
    };
    return wsclient;
  };

  var setMessageReceivedWs = function(callback) {

    wsclient.serviceHandlers.messageReceived = function (message) {
      try {
        var data = jsonic(message.utf8Data);
        if (data && data.M) {
          data.M.forEach(function(M) {
            callback(M);
          })
        } else {
          // ((opts.verbose) ? console.log('Unhandled data', data) : '');
          callback({'unhandled_data' : data});
        }
      } catch (e) {
        ((opts.verbose) ? console.error(e) : '');
      }
      return false; 
    }
  };

  var setConnectedWs = function(markets) {
    wsclient.serviceHandlers.connected = function(connection) {
      markets.forEach(function(market) {
        wsclient.call('CoreHub', 'SubscribeToExchangeDeltas', market).done(function(err, result) {
          if (result === true) {
            ((opts.verbose) ? console.log('Subscribed to ' + market) : '');
          }
        });
      });
      ((opts.verbose) ? console.log('Websocket connected') : '');
    }
  };

  return {
    options : function(options) {
      extractOptions(options);
    },
    websockets : {
      client : function(callback) {
        return connectws();
      },
      listen : function(callback) {
        var client = connectws();
        setMessageReceivedWs(callback);
        return client;
      },
      subscribe : function(markets, callback) {
        var client = connectws();
        setConnectedWs(markets);
        setMessageReceivedWs(callback);
        return client;
      }
    },
    sendCustomRequest : function(request_string, callback, credentials) {
      var op;

      if (credentials === true) {
        op = apiCredentials(request_string);
      } else {
        op = request_options;
        op.uri = request_string;
      }
      sendRequestCallback(callback, op);
    },
    getmarkets: function(callback) {
      var op = request_options;
      op.uri = opts.baseUrl + '/public/getmarkets';
      sendRequestCallback(callback, op);
    },
    getcurrencies: function(callback) {
      var op = request_options;
      op.uri = opts.baseUrl + '/public/getcurrencies';
      sendRequestCallback(callback, op);
    },
    getticker: function(options, callback) {
      var op = setRequestUriGetParams(opts.baseUrl + '/public/getticker', options);
      sendRequestCallback(callback, op);
    },
    getmarketsummaries: function(callback) {
      var op = request_options;
      op.uri = opts.baseUrl + '/public/getmarketsummaries';
      sendRequestCallback(callback, op);
    },
    getmarketsummary: function(options, callback) {
      var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarketsummary', options);
      sendRequestCallback(callback, op);
    },
    getorderbook: function(options, callback) {
      var op = setRequestUriGetParams(opts.baseUrl + '/public/getorderbook', options);
      sendRequestCallback(callback, op);
    },
    getmarkethistory: function(options, callback) {
      var op = setRequestUriGetParams(opts.baseUrl + '/public/getmarkethistory', options);
      sendRequestCallback(callback, op);
    },
    buylimit: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/buylimit'), options);
      sendRequestCallback(callback, op);
    },
    selllimit: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/selllimit'), options);
      sendRequestCallback(callback, op);
    },
    cancel: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/cancel'), options);
      sendRequestCallback(callback, op);
    },
    getopenorders: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/market/getopenorders'), options);
      sendRequestCallback(callback, op);
    },
    getbalances: function(callback) {
      var op = apiCredentials(opts.baseUrl + '/account/getbalances');
      sendRequestCallback(callback, op);
    },
    getbalance: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getbalance'), options);
      sendRequestCallback(callback, op);
    },
    getwithdrawalhistory: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getwithdrawalhistory'), options);
      sendRequestCallback(callback, op);
    },
    getdepositaddress: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdepositaddress'), options);
      sendRequestCallback(callback, op);
    },
    getdeposithistory: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getdeposithistory'), options);
      sendRequestCallback(callback, op);
    },
    getorderhistory: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorderhistory'), options);
      sendRequestCallback(callback, op);
    },
    getorder: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/getorder'), options);
      sendRequestCallback(callback, op);
    },
    withdraw: function(options, callback) {
      var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + '/account/withdraw'), options);
      sendRequestCallback(callback, op);
    }
  };
}();

module.exports = NodeBittrexApi;
