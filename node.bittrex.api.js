/* ============================================================
 * node.bittrex.api v0.1.2
 * https://github.com/n0mad01/node.bittrex.api
 *
 * ============================================================
 * Copyright 2014, Adrian Soluch - http://soluch.at/
 * Released under the MIT License 
 * ============================================================ */

var request = require("request"),
    q = require('q');

var NodeBittrexApi = function() {

    var self = this;
    var deferred = q.defer();
    var verbose = false;
    var baseUrl = 'https://bittrex.com/api/v1';
    var request_options = {
		method  : 'GET',
		headers : {
			"User-Agent": "Mozilla/4.0 (compatible; Bittrex API node client)",
			"Content-type": "application/x-www-form-urlencoded"
		},
		agent   : false
	};
    var returnCleartext = false;
    var stream = false;
    var start;
    var end;
    var JSONStream = null;
    var es = null;

    var getNonce = function() {
        return new Date().getTime();
    };

    var switchStream = function( state ) {

        if( state === true ) {
            JSONStream = require('JSONStream');
            es = require('event-stream');
            stream = true;
        }
        else {
            stream = false;
        }
    };

    var extractOptions = function( options ) {

        for( key in options ) {

            switch( key ) {

                case 'apikey' : 
                    self.apiKey = options[key];
                break;
                case 'stream' : 
                    switchStream( options[key] );
                break;
                case 'verbose' : 
                    self.verbose = options[key];
                break;
                case 'cleartext' : 
                    self.returnCleartext = options[key];
                break;
                break;
            }
        }
    };

    var apiCredentials = function( uri ) {

        var options = {
            apikey  : self.apiKey,
            nonce   : getNonce()
        };
        return setRequestUriGetParams( uri, options ); 
    };

    var setRequestUriGetParams = function( uri, options ) {

        for( key in options ) {
            uri = updateQueryStringParameter( uri, key, options[key] );
        }
        return uri;
    };

    var updateQueryStringParameter = function( uri, key, value ) {

        var re = new RegExp( "([?&])" + key + "=.*?(&|$)", "i" );
        var separator = uri.indexOf( '?' ) !== -1 ? "&" : "?";

        if( uri.match( re ) ) { uri = uri.replace( re, '$1' + key + "=" + value + '$2' ); }
        else { uri = uri + separator + key + "=" + value; }
        return uri;
    }

    var sendRequestCallback = function( callback ) {

        start = Date.now();

        switch( stream ) {

            case true : 
                request({ url : request_options.uri })
                    .pipe( JSONStream.parse())
                    .pipe( es.mapSync( function( data ) {
                        callback( data );
                        ( ( self.verbose ) 
                            ? console.log( "Streamed in: %ds", ( Date.now() - start ) / 1000 ) : '' );
                    }));
                break;
            case false : 
                sendRequest().then( function( data ) {
                    callback( ( ( self.returnCleartext ) ? data : JSON.parse( data ) ) );
                    ( ( self.verbose ) 
                        ? console.log( "Time taken: %ds", ( Date.now() - start ) / 1000 ) : '' );
                });
                break;
            default :
                break;
        }
    };

    var sendRequest = function() {

        request( request_options, function( error, result, body ) {

			if( ! body || ! result || result.statusCode != 200 ) {
                deferred.reject( new Error( error ) );
			}
			else {
                deferred.resolve( body );
			}
        });

        return deferred.promise;
    };

    return {

        options : function( options ) {
            extractOptions( options );
        },
        sendCustomRequest : function( request_string, callback ) {

            request_options.uri = request_string;
            sendRequestCallback( callback );
        },
        getmarkets : function( callback ) {

            request_options.uri = baseUrl +'/public/getmarkets';
            sendRequestCallback( callback );
        },
        getcurrencies : function( callback ) {
            
            request_options.uri = baseUrl +'/public/getcurrencies';
            sendRequestCallback( callback );
        },
        getticker : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( baseUrl +'/public/getticker', options ); 
            sendRequestCallback( callback );
        },
        getmarketsummaries : function( callback ) {

            request_options.uri = baseUrl +'/public/getmarketsummaries';
            sendRequestCallback( callback );
        },
        getorderbook : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( baseUrl +'/public/getorderbook', options ); 
            sendRequestCallback( callback );
        },
        getmarkethistory : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( baseUrl +'/public/getmarkethistory', options ); 
            sendRequestCallback( callback );
        },
        getbalances : function( callback ) {

            request_options.uri = apiCredentials( baseUrl +'/account/getbalances' );
            sendRequestCallback( callback );
        },
        getbalance : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( baseUrl +'/account/getbalances' ), options ); 
            sendRequestCallback( callback );
        },
        getwithdrawalhistory : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( baseUrl +'/account/getwithdrawalhistory' ), options ); 
            sendRequestCallback( callback );
        },
        getdepositaddress : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( baseUrl +'/account/getdepositaddress' ), options ); 
            sendRequestCallback( callback );
        }
    };

}();

module.exports = NodeBittrexApi;
