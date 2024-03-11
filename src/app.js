const check_spread = require('./check_spread.js');
const { orders, market_price, orderEventEmitter } = require('./server.js');

orderEventEmitter.on('ordersChanged', () => {
    console.log(orders);
    console.log(market_price);
});