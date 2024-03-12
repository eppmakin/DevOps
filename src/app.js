const { state, market_price, orderEventEmitter } = require('./server.js');
const { getTrades, setTrades } = require('./trades.js');
const matchOrders = require('./match_order.js');

requests = []

orderEventEmitter.on('orderChanged', () => {
    console.log(state.order);
    console.log(market_price);
    matchingResults = matchOrders(requests, state.order);
    setTrades(matchingResults[0]);
    requests = matchingResults[1];
    console.log(requests);
    console.log(getTrades());
});