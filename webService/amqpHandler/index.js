const amqpReconnect = require('./amqpReconnect');
const rpcQueues = require('./setupRPCQueues');
const {publish} = require('./publish');

module.exports = {
    publish,
    rpcQueues,
    ...amqpReconnect
};