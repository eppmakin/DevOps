const http = require('http');
const url = require('url');
const querystring = require('querystring');
const check_spread = require('./check_spread.js');
const EventEmitter = require('events');
class OrderEventEmitter extends EventEmitter {}
const orderEventEmitter = new OrderEventEmitter();
const axios = require('axios');
const trades = [{price: 100, quantity: 10, type: 'bid'}, {price: 101, quantity: 10, type: 'offer'}];

let market_price = 0;

async function getMarketPrice() {
  try {
    const response = await axios.get('https://api.marketdata.app/v1/stocks/quotes/AAPL/?human=false');
    console.log(response.data);
    market_price = response.data.last[0];
    console.log(market_price);
} catch (error) {
    console.error(`Error: ${error}`);
  }
}

function returnTrades() {
    return JSON.stringify(trades);
}


const orders = [];

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/order') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const orderData = querystring.parse(body);
            const order_price = orderData.price / orderData.quantity;
            const order_type = orderData.type.toLowerCase();
            if (order_type != 'bid' && order_type != 'offer') {
                res.end('Invalid order type');
            }
            else if (!check_spread(market_price, order_price)) {
                res.end('Order price is not within allowed spread');
            }
            else {
                const order = {
                    order: order_type,
                    price: parseInt(orderData.price, 10),
                    quantity: parseInt(orderData.quantity, 10)
                };
                orders.push(order);
                orderEventEmitter.emit('ordersChanged');
                res.end('Order received');
            } 
        });
        
        }
        else if (req.method === 'GET' && req.url === '/trades') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(returnTrades());
        }
         else {
            res.end('Invalid request');
        }
        });

server.listen(3000, async () => {
    console.log('Server listening on port 3000');

    await getMarketPrice();
    setInterval(getMarketPrice, 60 * 60 * 1000);
    
}

);

module.exports = {
    server,
    orders,
    market_price,
    orderEventEmitter: orderEventEmitter
};