function ynnays(a, b) {
    return a + b;
  }

function terve() {
    return 'Hello world!';
}

function check_spread(price, bid) {
    let difference = Math.abs(price - bid);
    let tenPercent = Math.max(price, bid) * 0.1;
    return difference <= tenPercent;
}

module.exports = {
    ynnays,
    terve,
    check_spread
};