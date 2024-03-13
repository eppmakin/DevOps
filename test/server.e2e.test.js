const http = require('http');
const assert = require('assert');
const app = require('../src/server.js');
const { setMarketPrice } = require('../src/server.js');
const { state, orderEventEmitter } = require('../src/server.js');
const matchOrders = require('../src/match_order.js');
const { setTrades, resetTrades } = require('../src/trades.js');

let requests = [];

function sendOrderRequest(type, price, quantity, expectedStatusCode, expectedResponse, done, port) {
    const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/order',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            assert.strictEqual(res.statusCode, expectedStatusCode);
            assert.strictEqual(data, expectedResponse);
            done();
        });
    });

    req.on('error', done);
    req.write(`type=${type}&price=${price}&quantity=${quantity}`);
    req.end();
}


describe('Verify Trades happen according to the given logic', function() {
    const port = 3000;
    let server;
    let lastTradePrice = 200; // Different last traded price

    this.timeout(5000); // Set timeout to 5000ms

    before(function() {
        // Set a fixed market price before running the tests
        setMarketPrice(lastTradePrice);
    });

    // Start a new server before each test
    beforeEach(done => {
        server = require('../src/server.js').server;
        server.listen(port, done);

        // Add a listener for the 'orderChanged' event
        orderEventEmitter.on('orderChanged', () => {
            let matchingResults = matchOrders(requests, state.order);
            setTrades(matchingResults[0]);
            requests = matchingResults[1];
        });
    });


    // Close the server after each test
    afterEach(done => {
        // Remove the 'orderChanged' listener
        orderEventEmitter.removeAllListeners('orderChanged');
        server.close(done);
    });

    it('Ord 1 - Bid Price: M3, Qty: 100', done => {
        sendOrderRequest('bid', lastTradePrice, 100, 200, 'Order received', done, port);
    });

    it('Ord 2 - Offer, Price: M3 x 0.8, Qty: 200', done => {
        sendOrderRequest('offer', lastTradePrice * 0.8, 200, 400, 'Order price is not within allowed spread', done, port);
    });

    it('Ord 3 - Bid Price: M3 x 1.01, Qty: 200', done => {
        sendOrderRequest('bid', lastTradePrice * 1.01, 200, 200, 'Order received', done, port);
    });

    it('Ord 4 - Bid Price: M3 x 0.95, Qty: 50', done => {
        sendOrderRequest('bid', lastTradePrice * 0.95, 50, 200, 'Order received', done, port);
    });

    it('Ord 5 - Bid Price: M3, Qty: 30', done => {
        sendOrderRequest('bid', lastTradePrice, 30, 200, 'Order received', done, port);
    });

    it('Ord 6 - Offer, Price: M3, Qty 250 - T1', done => {
        sendOrderRequest('offer', lastTradePrice, 250, 200, 'Order received', done, port);
    });

    it('should fetch trades', done => {
        http.get('http://localhost:3000/trades', res => {
            let data = '';
    
            res.on('data', chunk => {
                data += chunk;
            });
    
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    throw new Error(`Expected status code 200 but received ${res.statusCode}`);
                }
    
                const trades = JSON.parse(data);
                console.log(trades);
    
                done();
            });
        });
    });

});



describe('Verify input prices are validated based on latest market data', function() {
    const port = 3000;
    let server;
    let lastTradePrice = 170;

    this.timeout(5000); // Set timeout to 5000ms

    before(function() {
        // Set a fixed market price before running the tests
        setMarketPrice(lastTradePrice);
    });
  
    // Start a new server before each test
    beforeEach(done => {
        server = require('../src/server.js').server;
        server.listen(port, done);
        resetTrades();
    });
    
    // Close the server after each test
    afterEach(done => {
      server.close(done);
    });
  
    it('should accept Bid order at Price M1 x 1.08', done => {
        const bidPrice = lastTradePrice * 1.08;
        sendOrderRequest('bid', bidPrice, 1, 200, 'Order received', done, port);
    });
    it('should accept Offer order at Price M1 x 0.90', done => {
        const offerPrice = lastTradePrice * 0.90;
        sendOrderRequest('offer', offerPrice, 1, 200, 'Order received', done, port);
    });
    
    it('should reject Bid order at Price M1 x 1.11', done => {
        const bidPrice = lastTradePrice * 1.11;
        sendOrderRequest('bid', bidPrice, 1, 400, 'Order price is not within allowed spread', done, port);
    });
    
    it('should reject Offer order at Price M1 x -1.01', done => {
        const offerPrice = lastTradePrice * -1.01;
        sendOrderRequest('offer', offerPrice, 1, 400, 'Order price is not within allowed spread', done, port);
    });

    it('should verify no trades have happened', done => {
        http.get('http://localhost:3000/trades', res => {
            let data = '';
    
            res.on('data', chunk => {
                data += chunk;
            });
    
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    throw new Error(`Expected status code 200 but received ${res.statusCode}`);
                }
    
                if (JSON.parse(data).length !== 0) {
                    throw new Error(`Expected empty array but received ${JSON.parse(data)}`);
                }
    
                done();
            });
        });
    });
});

describe('Verify input quantity is valid', function() {
    const port = 3000;
    let server;
    let lastTradePrice = 180; // Different last traded price

    this.timeout(5000); // Set timeout to 5000ms

    before(function() {
        // Set a fixed market price before running the tests
        setMarketPrice(lastTradePrice);
    });

    // Start a new server before each test
    beforeEach(done => {
        server = require('../src/server.js').server;
        server.listen(port, done);
    });

    // Close the server after each test
    afterEach(done => {
        server.close(done);
    });

    it('should reject Bid order at Price M2, Qty 0', done => {
        sendOrderRequest('bid', lastTradePrice, 0, 400, 'Order quantity is not valid', done, port);
    });
    
    it('should reject Bid order at Price M2, Qty 10.1', done => {
        sendOrderRequest('bid', lastTradePrice, 10.1, 400, 'Order quantity is not valid', done, port);
    });
    
    it('should reject Offer order at Price M2, Qty -100', done => {
        sendOrderRequest('offer', lastTradePrice, -100, 400, 'Order quantity is not valid', done, port);
    });

    it('should verify no trades have happened', done => {
        http.get('http://localhost:3000/trades', res => {
            let data = '';
    
            res.on('data', chunk => {
                data += chunk;
            });
    
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    throw new Error(`Expected status code 200 but received ${res.statusCode}`);
                }
    
                if (JSON.parse(data).length !== 0) {
                    throw new Error(`Expected empty array but received ${JSON.parse(data)}`);
                }
    
                done();
            });
        });
    });
});
