const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const app = require('../../src/check_spread.js');

Given('the price is {int}', function (price) {
  this.price = price;
});

Given('the bid is {int}', function (bid) {
  this.bid = bid;
});

When('I check the spread', function () {
  this.result = app.check_spread(this.price, this.bid);
});

Then('the result should be {word}', function (expected) {
  assert.strictEqual(this.result.toString(), expected);
});