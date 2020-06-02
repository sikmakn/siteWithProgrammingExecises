const EventEmitter = require("events");
const {pubExchanges} = require("../../options");
const {setup: subscribe} = require("./subscribe");
const {setup: setupSender} = require('./sender');
const {setup: setupReciever} = require('./reciever');

async function index(channel) {
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    setupSender(channel);
    assertPublisher(channel);
    setupReciever(channel);
    await subscribe(channel);
}

function assertPublisher(channel) {
    if (pubExchanges)
        for (let exchange of Object.values(pubExchanges))
            channel.assertExchange(exchange, "fanout", {durable: false});
}


module.exports = index;
