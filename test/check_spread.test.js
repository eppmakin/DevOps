const assert = require('assert').strict;
const check_spread = require('../src/check_spread.js');

describe('Check Spread', function() {
  it('should return true if the difference is less than or equal to 10% of the maximum', function() {
    let result = check_spread(100, 90);
    assert.equal(result, true);
  });

  it('should return false if the difference is more than 10% of the maximum', function() {
    let result = check_spread(100, 80);
    assert.equal(result, false);
  });
});