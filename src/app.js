const { state, market_price, orderEventEmitter } = require('./server.js');
const { getTrades, setTrades } = require('./trades.js');
const matchOrders = require('./match_order.js');

requests = []

orderEventEmitter.on('orderChanged', () => {
    console.log(state.order);
    console.log(market_price);
    requests, newTrades = matchOrders(requests, state.order);
    setTrades(newTrades);
    console.log(requests);
    console.log(getTrades());
});