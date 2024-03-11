const check_spread = require('./check_spread.js');
const matchOrders = require('./match_order.js');

// Example case of a trade
let existingOrders = [
    { type: 'Bid', price: 100, quantity: 50  },
    { type: 'Bid', price: 105, quantity: 100 },
    { type: 'Bid', price: 95, quantity: 100  }
];
const newOrder = { type: 'Offer', price: 100, quantity: 200 };

// Using the matchOrders function to match the orders
const result = matchOrders(existingOrders, newOrder);
let trades = result.trades;
// matchOrders also returns all the existing orders after a trade. This should provide a way to keep track of trades.
existingOrders = result.existingOrders;

// Logging the trades
console.log("");
console.log("Trades: " + JSON.stringify(trades));
console.log("");
console.log("Existing orders after a trade: " + JSON.stringify(existingOrders));
console.log("");
// New order remains unchanged
console.log(newOrder);

