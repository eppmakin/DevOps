function check_spread(price, bid) {
    let difference = Math.abs(price - bid);
    let tenPercent = Math.max(price, bid) * 0.1;
    return difference <= tenPercent;
}

module.exports = {
    check_spread: check_spread
}