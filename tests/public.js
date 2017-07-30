var assert = require('assert');
var bittrex = require('../node.bittrex.api.js');

describe('Bittrex public API', function() {

  it('sendCustomRequest should error if the url doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      var url = 'http://fake.bittrex.com/api/v1.1/public/getticker?market=USDT-BTCXXX';
      bittrex.sendCustomRequest( url, function( data, err ) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('sendCustomRequest should error if the url doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      var url = 'http://bittrex.com/api/v1.1/public/getfakeendpoint';
      bittrex.sendCustomRequest( url, function( data, err ) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        assert.ok(err.result.statusCode == 404);
        done();
      });
    }, 500);
  });

  it('should respond with markets data', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarkets(function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length > 0);
        done();
      });
    }, 500); //delay the tests so we do not trigger any Bittrex rate limits
  });

  it('should respond with currencies data', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getcurrencies(function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with an error for ticker request without a market', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getticker({}, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with an error for ticker request for market that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getticker({ market: 'USDT-XTESTX' }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with ticker data for BTC/USDT', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getticker({ market: 'USDT-BTC' }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.notEqual(typeof(data.result.Bid), 'undefined');
        done();
      });
    }, 500);
  });

  it('should respond with all market summaries data', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarketsummaries(function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with market summary for BTC/USDT', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarketsummary({ market: 'USDT-BTC' }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length == 1);
        assert.notEqual(typeof(data.result[0].Bid), 'undefined');
        done();
      });
    }, 500);
  });

  it('should error for a market summary that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarketsummary({ market: 'USDT-XTESTX' }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a market summary without a market', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarketsummary({}, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with order book for BTC/USDT', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getorderbook({ market: 'USDT-BTC', type: 'both', depth: 10 }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.notEqual(typeof(data.result.buy), 'undefined');
        assert.notEqual(typeof(data.result.sell), 'undefined');
        done();
      });
    }, 500);
  });

  it('should error for a order book that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getorderbook({ market: 'USDT-XTESTX', type: 'both', depth: 10 }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a order book without a market', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getorderbook({ type: 'both', depth: 10 }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with market history for BTC/USDT', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarkethistory({ market: 'USDT-BTC' }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a market history that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarkethistory({ market: 'USDT-XTESTX' }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a market history without a market', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getmarkethistory({ }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should respond with candles for BTC/USDT', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getcandles({
        marketName: 'USDT-BTC',
        tickInterval: 'fiveMin', // intervals are keywords
        _: ((new Date()).getTime()/1000)-(300*5) // start timestamp
      }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.ok(data.result.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a candles that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getcandles({ marketName: 'USDT-XTESTX', tickInterval: 300 }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should error for a candles without a market', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getcandles({ }, function(data, err) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

  it('should get ticker data via sendCustomRequest', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      var url = 'https://bittrex.com/api/v1.1/public/getticker?market=USDT-BTC';
      bittrex.sendCustomRequest( url, function( data, err ) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        assert.notEqual(typeof(data.result.Bid), 'undefined');
        done();
      });
    }, 500);
  });

  it('should error with request for ticker data that doesnt exist via sendCustomRequest', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      var url = 'https://bittrex.com/api/v1.1/public/getticker?market=USDT-BTCXXX';
      bittrex.sendCustomRequest( url, function( data, err ) {
        assert.equal(data, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500);
  });

});