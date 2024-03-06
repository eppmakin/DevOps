// src/match_order.js
// Helper function to match orders. App.js (or what ever) will call this function to match orders.

// This is a first draft of the match algorithm. It has been developed without the knowledge of how
// the actual REST api etc. will look like.

// TODO: Dates need to be handled properly. The current implementation is not ideal. 
// The way of recording trade times is not implemented either. Just using date.now() for now.

// The function takes in an array of existing orders and a new order. It then checks if any trades are applicable.
// The function should return an object with the following properties:
// - trades: an array of trades that were executed
// - existingOrders: an array of orders that were not matched
function matchOrders(existingOrders, order) {
    // Creating a copy of the new order just in case.
    const newOrder = {...order};
    // Sort the existing orders based on the type of the new order
    const sortedOrders = [...existingOrders].sort((a, b) => {
        if (newOrder.type === 'Bid') {
            if (a.price !== b.price) {
                return a.price - b.price; // sort in ascending order of price for bids
            }   
        } else if (newOrder.type === 'Offer') {
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
            const trade = matchOrder(newOrder, sortedOrders[i]);
            if (trade) {
                matchedTrades.push(trade);
                remainingQuantity -= trade.quantity;
                newOrder.quantity -= trade.quantity; // update the quantity of the new order

                // Log the details of the successful trade
                console.log(`Trade successful: ${JSON.stringify(trade)}`);

                // Remove the matched order from the sortedOrders array
                sortedOrders.splice(i, 1);
                i--; // decrement i to account for the removed order
            }
        }
    }

    if (remainingQuantity > 0) {
        storeUnmatchedOrder(sortedOrders, newOrder, remainingQuantity);
    }

    // Update existingOrders with the state of sortedOrders
    existingOrders.length = 0;
    existingOrders.push(...sortedOrders);
    // Return the matched trades and the updated existing orders
    return { trades: matchedTrades, existingOrders: sortedOrders };
}

function matchOrder(newOrder, existingOrder) {
    // For bids, only match if the new order's price is the highest among all orders
    // For offers, only match if the new order's price is the lowest among all orders
    if ((newOrder.type === 'Bid' && newOrder.price >= existingOrder.price) ||
        (newOrder.type === 'Offer' && newOrder.price <= existingOrder.price)) {
        const tradedQuantity = Math.min(existingOrder.quantity, newOrder.quantity);
        const tradedPrice = Math.max(existingOrder.price, newOrder.price);
        return {
            time: Date.now(),
            price: tradedPrice,
            quantity: tradedQuantity
        };
    }
    return null; // return null if the new order cannot be matched
}

// Store the unmatched order in the system for future matching
function storeUnmatchedOrder(existingOrders, newOrder, remainingQuantity) {
    // Log the details of the unmatched order
    console.log(`Storing unmatched order: ${newOrder.type} - Quantity: ${remainingQuantity}`);
    // Update the quantity of the new order
    newOrder.quantity = remainingQuantity;
    // Add the order to the unmatched orders array
    existingOrders.push(newOrder);
}

module.exports = matchOrders;