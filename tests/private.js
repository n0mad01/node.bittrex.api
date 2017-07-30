var assert = require('assert');
var bittrex = require('../node.bittrex.api.js');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));

bittrex.options({
  'apikey' : config.api.key,
  'apisecret' : config.api.secret, 
});

describe('Bittrex private API', function() {

  it('should respond with withdraw history for BTC', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getwithdrawalhistory({
        currency: 'BTC',
      }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        done();
      });
    }, 500); //delay the tests so we do not trigger any Bittrex rate limits
  });

  it('should respond with deposit history for BTC', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getdeposithistory({
        currency: 'BTC',
      }, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        done();
      });
    }, 500); //delay the tests so we do not trigger any Bittrex rate limits
  });

  it('should respond with an error for a deposit history request for a currency that doesnt exist', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getdeposithistory({
        currency: 'BTCXX',
      }, function(data, err) {
        assert.equal(data, null);
        assert.notEqual(err, null);
        assert.ok(err.success == false);
        assert.ok(err.message.length > 0);
        done();
      });
    }, 500); //delay the tests so we do not trigger any Bittrex rate limits
  });

  it('should respond with order history', function(done) {
    this.timeout(5000);
    setTimeout(function() {
      bittrex.getorderhistory({}, function(data, err) {
        assert.equal(err, null);
        assert.ok(data.success == true);
        done();
      });
    }, 500); //delay the tests so we do not trigger any Bittrex rate limits
  });

});