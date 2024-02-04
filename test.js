const assert = require('assert');
const app = require('./app.js');

const result1 = app.ynnays(2, 3);
const expected1 = 5;
assert.strictEqual(result1, expected1, 'Ynnäys ei onnistunut.');

const result2 = app.terve();
const expected2 = 'Hello world!'
assert.strictEqual(result2, expected2, 'Tervehdys ei onnistunut.');

const result3 = app.failure(1, 1);
const expected3 = 2
assert.strictEqual(result3, expected3, 'Esimerkki läpäisemättömästä testistä.');


console.log('----- Test Results -----');
console.log(`Total tests: ${2}`);
console.log(`Tests passed: ${2 - assert.failures}`);
console.log(`Tests failed: ${assert.failures}`);
