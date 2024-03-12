let trades = [];

function getTrades() {
    return trades;
}

function setTrades(newTrades) {
    trades = newTrades;
}

module.exports = {
    getTrades,
    setTrades
};