const { state, market_price, orderEventEmitter } = require('./server.js');

orderEventEmitter.on('orderChanged', () => {
    console.log(state.order);
    console.log(market_price);
});
const check_spread = require('./check_spread.js');
const matchOrders = require('./match_order.js');
