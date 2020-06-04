const {rpcServices, replyRPCQueueName} = require("../../options");

function assert(channel) {
    for (let {serviceName} of Object.values(rpcServices))
        channel.assertQueue(serviceName + replyRPCQueueName, {durable: false});
}

function consume(channel) {
    for (let {serviceName} of Object.values(rpcServices))
        channel.consume(
            serviceName + replyRPCQueueName,
            (msg) => channel.responseEmitter.emit(msg.properties.correlationId, msg.content),
            {noAck: true}
        );
}

module.exports = {
    setup: (channel) => {
        if (!rpcServices) return;
        assert(channel);
        consume(channel);
    }
};