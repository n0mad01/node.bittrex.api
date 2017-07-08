
const bittrex = require('../node.bittrex.api');

/**
 *  a bare client
 */
var websocketsclient = bittrex.websockets.client();

/**
 *  the messages received must be parsed as json first e.g. via jsonic(message.utf8Data)
 */
websocketsclient.serviceHandlers.messageReceived = function (message) {
  console.log(message);
}

/**
 *  all possible serviceHandlers:
 *  
 *  bound: function() { console.log("Websocket bound"); },
 *  connectFailed: function(error) { console.log("Websocket connectFailed: ", error); },
 *  connected: function(connection) { console.log("Websocket connected"); },
 *  disconnected: function() { console.log("Websocket disconnected"); },
 *  onerror: function (error) { console.log("Websocket onerror: ", error); },
 *  messageReceived: function (message) { console.log("Websocket messageReceived: ", message); return false; },
 *  bindingError: function (error) { console.log("Websocket bindingError: ", error); },
 *  connectionLost: function (error) { console.log("Connection Lost: ", error); },
 *  reconnecting: function (retry { inital: true/false, count: 0} ) {
 *      console.log("Websocket Retrying: ", retry);
 *      //return retry.count >= 3; // cancel retry true
 *      return true;
 *  }
 */
websocketsclient.serviceHandlers.onerror = function (error) {
  console.log('some error occured', error);
}
