const EventEmitter = require('events');
const {rpcServices} = require('../options');

async function setupChannel(channel) {
    channel.responseEmitter = new EventEmitter();
    channel.responseEmitter.setMaxListeners(0);
    const assertPromises = assertQueues(channel);
    const consumePromises = consumeQueues(channel);
    return Promise.all(assertPromises).then(res => Promise.all(consumePromises));
}

function assertQueues(channel) {
    const promises = [];
    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}Reply`;
        const assertPromise = channel.assertQueue(replyQueue, {durable: false});
        promises.push(assertPromise);
    }
    return promises;
}

function consumeQueues(channel) {
    const promises = [];
    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}Reply`;
        const consumePromise = channel.consume(
            replyQueue,
            (msg) =>
                channel.responseEmitter.emit(
                    msg.properties.correlationId,
                    msg.content
                ),
            {noAck: true}
        );
        promises.push(consumePromise);
    }
    return promises;
}

module.exports = setupChannel;