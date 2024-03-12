let trades = [];

function getTrades() {
    return trades;
}

function setTrades(newTrades) {
    // trades = newTrades;
    trades = trades.concat(newTrades);
}

module.exports = {
    getTrades,
    setTrades
};