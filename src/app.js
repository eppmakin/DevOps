const { state, market_price, orderEventEmitter } = require('./server.js');

orderEventEmitter.on('orderChanged', () => {
    console.log(state.order);
    console.log(market_price);
});