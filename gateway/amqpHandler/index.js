const amqpReconnect = require('./amqpReconnect');
const rpcQueues = require('./setupRPCQueues');
const bufferMapper = require('../helpers/objBufferMapper');

async function publish(exchange, msg, topic = '') {
    const channel = await amqpReconnect.getChannel();
    channel.publish(exchange, topic, bufferMapper.objToBuffer(msg));
}

module.exports = {
    publish,
    rpcQueues,
    ...amqpReconnect
};