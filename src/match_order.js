// src/match_order.js
// Helper function to match orders. App.js (or what ever) will call this function to match orders.

// Import the chalk module
const chalk = require('chalk');

// The function takes in an array of existing orders and a new order. It then checks if any trades are applicable.
// The function should return an object with the following properties:
// - trades: an array of trades that were executed
// - existingOrders: an array of orders that were not matched
function matchOrders(existingOrders, order) {
    // Creating a copy of the new order just in case.
    const newOrder = {...order};
    // For logging purposes
    let tradeOccurred = false;
    console.log(chalk.white(`Received a new order: ${JSON.stringify(newOrder)}`));
    console.log(chalk.gray("Looking for possible trades..."));
    // Generate the timestamp before the matching process
    const date = new Date();
    const formattedDate = date.toLocaleString('en-GB').replace(',', '');
    // Sort the existing orders based on the type of the new order
    const sortedOrders = [...existingOrders].sort((a, b) => {
        if (newOrder.type === 'bid') {
            if (a.price !== b.price) {
                return a.price - b.price; // sort in ascending order of price for bids
            }   
        } else if (newOrder.type === 'offer') {
            if (a.price !== b.price) {
                return b.price - a.price; // sort in descending order of price for offers
        }
    }
        return 0; // if prices are equal, return the older order
    });

    let remainingQuantity = newOrder.quantity;
    let matchedTrades = [];

    for (let i = 0; i < sortedOrders.length; i++) {
        if (remainingQuantity <= 0) break;

        // Only match orders of the opposite type
        if (newOrder.type !== sortedOrders[i].type) {
            const trade = matchOrder(newOrder, sortedOrders[i], formattedDate);
            if (trade) {
                tradeOccurred = true;
                matchedTrades.push(trade);
                remainingQuantity -= trade.quantity;
                newOrder.quantity -= trade.quantity; // update the quantity of the new order

                // Log the details of the successful trade
                console.log(chalk.cyan('Found a match for the order. Initiating trade...'));
                console.log(chalk.green(`Trade successful: ${JSON.stringify(trade)}`));

                // Update the quantity of the matched order or remove it if it's fully matched
                if (sortedOrders[i].quantity > trade.quantity) {
                    sortedOrders[i].quantity -= trade.quantity;
                    console.log(chalk.yellow(`Remaining quantity of the matched order: ${sortedOrders[i].quantity}`));
                } else {
                    sortedOrders.splice(i, 1);
                    i--; // decrement i to account for the removed order
        }
            }
        }
    }

    if (remainingQuantity > 0) {
        storeUnmatchedOrder(sortedOrders, newOrder, remainingQuantity, tradeOccurred);
    }

    // Update existingOrders with the state of sortedOrders
    existingOrders.length = 0;
    existingOrders.push(...sortedOrders);
    // Return the matched trades and the updated existing orders
    return [matchedTrades, existingOrders];
}

function matchOrder(newOrder, existingOrder, formattedDate) {
    // For bids, only match if the new order's price is the highest among all orders
    // For offers, only match if the new order's price is the lowest among all orders
    if ((newOrder.type === 'bid' && newOrder.price >= existingOrder.price) ||
        (newOrder.type === 'offer' && newOrder.price <= existingOrder.price)) {
            const tradedQuantity = Math.min(existingOrder.quantity, newOrder.quantity);
            const tradedPrice = Math.max(existingOrder.price, newOrder.price);
            return {
                time: formattedDate,
                price: tradedPrice,
                quantity: tradedQuantity
        };
    }
    return null; // return null if the new order cannot be matched
}

// Store the unmatched order in the system for future matching
function storeUnmatchedOrder(existingOrders, newOrder, remainingQuantity, tradeOccurred) {
    // Log the details of the unmatched order
    if (tradeOccurred) {
        console.log(chalk.yellow("Order partially traded. Saving the remaining quantity..."));
    } else {
        console.log(chalk.red("No trades found for the order. Saving the order..."));
    }
    console.log(chalk.green(`Order saved successfully: ${JSON.stringify(newOrder)}`));
    // Update the quantity of the new order
    newOrder.quantity = remainingQuantity;
    // Add the order to the unmatched orders array
    existingOrders.push(newOrder);
}

module.exports = matchOrders;