/* ============================================================
 * node.bittrex.api v0.1.6
 * https://github.com/n0mad01/node.bittrex.api
 *
 * ============================================================
 * Copyright 2014, Adrian Soluch - http://soluch.at/
 * Released under the MIT License 
 * ============================================================ */


var NodeBittrexApi = function() {

    'use strict';

    var request = require( 'request' ),
        q = require( 'q' ),
        hmac_sha512 = require( './hmac-sha512.js' ),
        JSONStream = require( 'JSONStream' ),
        es = require( 'event-stream' );

    var deferred = q.defer(),
        start,
        end,
        request_options = {
		    method  : 'GET',
		    agent   : false,
		    headers : {
		    	"User-Agent" : "Mozilla/4.0 (compatible; Node Bittrex API)",
		    	"Content-type" : "application/x-www-form-urlencoded"
		    }
	    };

    var opts = {
        baseUrl : 'https://bittrex.com/api/v1.1',
        apikey : 'APIKEY',
        apisecret : 'APISECRET',
        verbose : false,
        cleartext : false,
        stream : false 
    };

    var getNonce = function() {
        return Math.floor( new Date().getTime() / 1000 );
    };

    var extractOptions = function( options ) {

        var o = Object.keys( options ),
            i;
        for( i = 0; i < o.length; i++ ) {
           opts[o[i]] = options[o[i]];
        }
    };

    var apiCredentials = function( uri ) {

        var options = {
            apikey  : opts.apikey,
            nonce   : getNonce()
        };

        return setRequestUriGetParams( uri, options ); 
    };

    var setRequestUriGetParams = function( uri, options ) {

        var o = Object.keys( options ),
            i;
        for( i = 0; i < o.length; i++ ) {
           uri = updateQueryStringParameter( uri, o[i], options[o[i]] );
        }

        request_options.headers.apisign = hmac_sha512.HmacSHA512( uri, opts.apisecret ); // setting the HMAC hash `apisign` http header

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

        switch( opts.stream ) {

            case true : 
                request( request_options )
                    .pipe( JSONStream.parse() )
                    .pipe( es.mapSync( function( data ) {
                        callback( data );
                        ( ( opts.verbose ) 
                            ? console.log( "streamed from "+ request_options.uri +" in: %ds", ( Date.now() - start ) / 1000 ) : '' );
                    }));
                break;
            case false : 
                sendRequest()
                .then( function( data ) {
                    
                    callback( ( ( opts.cleartext ) ? data : JSON.parse( data ) ) );
                    ( ( opts.verbose ) 
                        ? console.log( "requested from "+ request_options.uri +" in: %ds", ( Date.now() - start ) / 1000 ) : '' );
                })
                .catch( function( error ) {
                    console.error( error );
                })
                .done();
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
        sendCustomRequest : function( request_string, callback, credentials ) {

            request_options.uri = ( ( credentials === true ) ? apiCredentials( request_string ) : request_string );
            sendRequestCallback( callback );
        },
        getmarkets : function( callback ) {

            request_options.uri = opts.baseUrl +'/public/getmarkets';
            sendRequestCallback( callback );
        },
        getcurrencies : function( callback ) {
            
            request_options.uri = opts.baseUrl +'/public/getcurrencies';
            sendRequestCallback( callback );
        },
        getticker : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( opts.baseUrl +'/public/getticker', options ); 
            sendRequestCallback( callback );
        },
        getmarketsummaries : function( callback ) {

            request_options.uri = opts.baseUrl +'/public/getmarketsummaries';
            sendRequestCallback( callback );
        },
        getorderbook : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( opts.baseUrl +'/public/getorderbook', options ); 
            sendRequestCallback( callback );
        },
        getmarkethistory : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( opts.baseUrl +'/public/getmarkethistory', options ); 
            sendRequestCallback( callback );
        },
        getbalances : function( callback ) {

            request_options.uri = apiCredentials( opts.baseUrl +'/account/getbalances' );
            sendRequestCallback( callback );
        },
        getbalance : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( opts.baseUrl +'/account/getbalance' ), options ); 
            sendRequestCallback( callback );
        },
        getwithdrawalhistory : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( opts.baseUrl +'/account/getwithdrawalhistory' ), options ); 
            sendRequestCallback( callback );
        },
        getdepositaddress : function( options, callback ) {

            request_options.uri = setRequestUriGetParams( apiCredentials( opts.baseUrl +'/account/getdepositaddress' ), options ); 
            sendRequestCallback( callback );
        }
    };

}();

module.exports = NodeBittrexApi;
