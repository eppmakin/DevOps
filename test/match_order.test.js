const assert = require('assert');
const matchOrders = require('../src/match_order');

describe('matchOrders', function() {
    it('new bid should match with the cheapest offer 1st', function() {
        let trades = [];
        let existingOrders = [
            { type: 'offer', price: 100, quantity: 50},
            { type: 'offer', price: 105, quantity: 100}
        ];
        const newOrder = { type: 'bid', price: 110, quantity: 150};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 50); // The first offer had prio since it was cheaper
        assert.strictEqual(trades[1].price, 110);
        assert.strictEqual(trades[1].quantity, 100);
    });

    it('new offer should match with the most expensive bid 1st', function() {
        let trades = [];
        let existingOrders = [
            { type: 'bid', price: 105, quantity: 500},
            { type: 'bid', price: 110, quantity: 200}
        ];
        const newOrder = { type: 'offer', price: 100, quantity: 1500};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 200); // The first bid had prio since it was more expensive
        assert.strictEqual(trades[1].price, 105);
        assert.strictEqual(trades[1].quantity, 500);
    });

    it('new order should match with the oldest bid 1st, if the price is the same', function() {
        let trades = [];
        let existingOrders = [
            { type: 'bid', price: 205, quantity: 1000},
            { type: 'bid', price: 205, quantity: 500}
        ];
        const newOrder = { type: 'offer', price: 205, quantity: 3000};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);
    
        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 205); // 1st bid was older, with same price
        assert.strictEqual(trades[0].quantity, 1000); 
        assert.strictEqual(trades[1].price, 205);
        assert.strictEqual(trades[1].quantity, 500);
    });

    it('new bid should match with the oldest offer 1st, if the price is the same', function() {
        let trades = [];
        let existingOrders = [
            { type: 'offer', price: 100, quantity: 50},
            { type: 'offer', price: 100, quantity: 100}
        ];
        const newOrder = { type: 'bid', price: 110, quantity: 150};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 2);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 50); // The first offer had prio since it was older
        assert.strictEqual(trades[1].price, 110);
        assert.strictEqual(trades[1].quantity, 100);
    });

    it('should handle remaining quantities correctly', function() {
        let trades = [];
        let existingOrders = [
            { type: 'offer', price: 100, quantity: 50}
        ];
        const newOrder = { type: 'bid', price: 105, quantity: 70};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 1);
        assert.strictEqual(trades[0].price, 105);
        assert.strictEqual(trades[0].quantity, 50);

        // Check if the unmatched order is in the existingOrders array
        const unmatchedOrder = existingOrders.find(order => order.type === 'bid' && order.price === 105);
        assert.ok(unmatchedOrder, 'Unmatched order should be in the existingOrders array');
        assert.strictEqual(unmatchedOrder.quantity, 20, 'Unmatched order should have a quantity of 20');

        // Print the unmatched order to the console
        console.log('Unmatched order:', unmatchedOrder);
    });

    it('should not match orders if the bid price is lower than the offer price', function() {
        let trades = [];    
        let existingOrders = [
            { type: 'offer', price: 100, quantity: 50}
        ];
        const newOrder = { type: 'bid', price: 95, quantity: 70};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);
    
        assert.strictEqual(trades.length, 0); // No trades should be made
    });

    it('new bid should match with the oldest offer 1st, if the price is the same', function() {
        let trades = [];
        let existingOrders = [
            { type: 'offer', price: 100, quantity: 50},
            { type: 'offer', price: 100, quantity: 100},
            { type: 'bid', price: 100, quantity: 100},
            { type: 'offer', price: 100, quantity: 150}
        ];
        const newOrder = { type: 'bid', price: 110, quantity: 1500};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 3);
        assert.strictEqual(trades[0].price, 110);
        assert.strictEqual(trades[0].quantity, 50); // The first offer had prio since it was older
        assert.strictEqual(trades[1].price, 110);
        assert.strictEqual(trades[1].quantity, 100);
        assert.strictEqual(trades[2].price, 110);
        assert.strictEqual(trades[2].quantity, 150);
    });

    it('if there are no existing orders it should be added to the existing orders', function() {
        let trades = [];  
        let existingOrders = [];
        const newOrder = { type: 'bid', price: 110, quantity: 1500};
        [trades, existingOrders] = matchOrders(existingOrders, newOrder);

        assert.strictEqual(trades.length, 0);
        assert.deepStrictEqual(existingOrders[0], newOrder);
    });
});