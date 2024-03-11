const assert = require('assert');
const matchOrders = require('../src/match_order');

describe('matchOrders', function() {
    it('new bid should match with the cheapest offer 1st', function() {
        const existingOrders = [
            { type: 'Offer', price: 100, quantity: 50, timestamp: Date.now() - 1000 },
            { type: 'Offer', price: 105, quantity: 100, timestamp: Date.now() - 500 }
        ];
        const newOrder = { type: 'Bid', price: 110, quantity: 150, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 50); // The first offer had prio since it was cheaper
        assert.strictEqual(trades[1].price, 110);
        assert.strictEqual(trades[1].quantity, 100);
    });

    it('new offer should match with the most expensive bid 1st', function() {
        const existingOrders = [
            { type: 'Bid', price: 105, quantity: 500, timestamp: Date.now() - 1000 },
            { type: 'Bid', price: 110, quantity: 200, timestamp: Date.now() - 500 }
        ];
        const newOrder = { type: 'Offer', price: 100, quantity: 1500, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 200); // The first bid had prio since it was more expensive
        assert.strictEqual(trades[1].price, 105);
        assert.strictEqual(trades[1].quantity, 500);
    });

    it('new order should match with the oldest bid 1st, if the price is the same', function() {
        const existingOrders = [
            { type: 'Bid', price: 205, quantity: 1000, timestamp: Date.now() - 1000 },
            { type: 'Bid', price: 205, quantity: 500, timestamp: Date.now() - 500 }
        ];
        const newOrder = { type: 'Offer', price: 205, quantity: 3000, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;
    
        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 205); // 1st bid was older, with same price
        assert.strictEqual(trades[0].quantity, 1000); 
        assert.strictEqual(trades[1].price, 205);
        assert.strictEqual(trades[1].quantity, 500);
    });

    it('new bid should match with the oldest offer 1st, if the price is the same', function() {
        const existingOrders = [
            { type: 'Offer', price: 100, quantity: 50, timestamp: Date.now() - 1000 },
            { type: 'Offer', price: 100, quantity: 100, timestamp: Date.now() - 500 }
        ];
        const newOrder = { type: 'Bid', price: 110, quantity: 150, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 50); // The first offer had prio since it was older
        assert.strictEqual(trades[1].price, 110);
        assert.strictEqual(trades[1].quantity, 100);
    });

    it('should handle remaining quantities correctly', function() {
        let existingOrders = [
            { type: 'Offer', price: 100, quantity: 50, timestamp: Date.now() }
        ];
        const newOrder = { type: 'Bid', price: 105, quantity: 70, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;

        assert.strictEqual(trades.length, 1);
        assert.strictEqual(trades[0].price, 105);
        assert.strictEqual(trades[0].quantity, 50);
    });

    it('should not match orders if the bid price is lower than the offer price', function() {
        let existingOrders = [
            { type: 'Offer', price: 100, quantity: 50, timestamp: Date.now() }
        ];
        const newOrder = { type: 'Bid', price: 95, quantity: 70, timestamp: Date.now() };
        const result = matchOrders(existingOrders, newOrder);
        const trades = result.trades;
    
        assert.strictEqual(trades.length, 0); // No trades should be made
    });
});