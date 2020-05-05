const EventEmitter = require('events');
const {rpcServices, pubSubExchanges} = require('../options');

function setupChannel(channel) {
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    assertQueues(channel);
    consumeQueues(channel);
}

function assertQueues(channel) {
    for (let exchange in pubSubExchanges) {
        channel.assertExchange(pubSubExchanges[exchange], 'fanout', {durable: false});
    }

    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}Reply`;
        channel.assertQueue(replyQueue, {durable: false});
    }
}

function consumeQueues(channel) {
    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}Reply`;
        channel.consume(
            replyQueue,
            (msg) =>
                channel.responseEmitter.emit(
                    msg.properties.correlationId,
                    msg.content
                ),
            {noAck: true}
        );
    }
}

module.exports = setupChannel;