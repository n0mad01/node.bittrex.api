
const bittrex = require('../node.bittrex.api');

/**
 *  a bare client
 */
const websocketsclient = bittrex.websockets.client();

/**
 *  the messages received must be parsed as json first e.g. via jsonic(message.utf8Data)
 */
websocketsclient.serviceHandlers.messageReceived = function (message) {
  console.log(message);
}

/**
 *  all possible servicehandlers:
 *  
 *  bound: function() {}
 *  connectFailed: function(error) {}
 *  connected: function(connection) {}
 *  disconnected: function() {}
 *  onerror: function (error) {}
 *  messageReceived: function (message) {}
 *  bindingError: function (error) {}
 *  connectionLost: function (error) {}
 *  reconnecting: function (retry) {}
 */
websocketsclient.serviceHandlers.onerror = function (error) {
  console.log('some error occured', error);
}
