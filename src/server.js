const http = require('http');
const url = require('url');
const querystring = require('querystring');
const check_spread = require('./check_spread.js');
const EventEmitter = require('events');
class OrderEventEmitter extends EventEmitter {}
const orderEventEmitter = new OrderEventEmitter();
const axios = require('axios');
const { getTrades } = require('./trades.js');
// Import the chalk module
const chalk = require('chalk');

let market_price = 170;

async function getMarketPrice() {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get('https://api.marketdata.app/v1/stocks/quotes/AAPL/?human=false');
        console.log(chalk.yellow('Fetching market data...'));
        console.log(response.data.symbol);
        market_price = response.data.last[0];
        console.log(chalk.magenta("Last Traded Price: "+market_price));
        resolve(market_price);
      } catch (error) {
        console.error(`Error: ${error}`);
        reject(error);
      }
    });
  }
/*
// Fetch the market price when the server starts
getMarketPrice().catch(error => {
    console.error(`Failed to fetch market price: ${error}`);
});
*/
function setMarketPrice(price) {
    market_price = price;
}


function returnTrades() {
    let trades = getTrades();
    return JSON.stringify(trades);
}


let state = {
    order: {}
};

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/order') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const orderData = querystring.parse(body);
            const order_price = orderData.price;
            const order_type = orderData.type.toLowerCase();
            const order_quantity = parseFloat(orderData.quantity);

            if (order_type != 'bid' && order_type != 'offer') {
                res.statusCode = 400;
                res.end('Invalid order type');
            }
            else if (!check_spread(market_price, order_price)) {
                res.statusCode = 400;
                res.end('Order price is not within allowed spread');
            }
            else if (order_quantity <= 0 || !Number.isInteger(order_quantity) || order_quantity != orderData.quantity) {
                res.statusCode = 400;
                res.end('Order quantity is not valid');
            }
            else {
                state.order = {
                    type: order_type,
                    price: parseInt(orderData.price, 10),
                    quantity: parseInt(orderData.quantity, 10)
                };
                orderEventEmitter.emit('orderChanged');
                res.end('Order received');
            } 
        });
        
        }
        else if (req.method === 'GET' && req.url === '/trades') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(returnTrades());
        }
         else {
            res.statusCode = 400;
            res.end('Invalid request');
        }
});


module.exports = {
    server,
    state,
    market_price,
    orderEventEmitter: orderEventEmitter,
    getMarketPrice,
    setMarketPrice
};