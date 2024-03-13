const { json } = require("stream/consumers");

let trades = [];

function getTrades() {
    console.log(`Trade information: ${JSON.stringify(trades)}`);
    return trades;
}

function setTrades(newTrades) {
    trades = trades.concat(newTrades);
}

module.exports = {
    getTrades,
    setTrades
};