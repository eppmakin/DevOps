const { state, market_price, orderEventEmitter, getMarketPrice } = require('./server.js');
const { getTrades, setTrades } = require('./trades.js');
const matchOrders = require('./match_order.js');
// Import the chalk module
const chalk = require('chalk');

requests = []

orderEventEmitter.on('orderChanged', () => {
    // console.log(state.order);
    // console.log(market_price);
    matchingResults = matchOrders(requests, state.order);
    setTrades(matchingResults[0]);
    requests = matchingResults[1];
    // console.log(requests);
    // console.log(getTrades());
});

const { server } = require('./server.js');

server.listen(3000, async () => {
    console.log(chalk.green('Server listening on port 3000'));

  await getMarketPrice();
  setInterval(getMarketPrice, 60 * 60 * 1000);   
});