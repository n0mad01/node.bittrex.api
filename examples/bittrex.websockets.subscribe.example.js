
const bittrex = require('../node.bittrex.api');

bittrex.options({ 
  'verbose' : true, 
});

const websocketsclient = bittrex.websockets.subscribe(['BTC-ETH','BTC-SC','BTC-ZEN'], function(data) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  }
});
