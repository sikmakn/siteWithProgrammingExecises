const {rpcServices, serviceName} = require("../../options");

function assert(channel) {
    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}${serviceName}Reply`;
        channel.assertQueue(replyQueue, {durable: false});
    }
}

function consume(channel) {
    for (let service in rpcServices) {
        const replyQueue = `${rpcServices[service].serviceName}${serviceName}Reply`;
        channel.consume(
            replyQueue,
            (msg) => channel.responseEmitter.emit(msg.properties.correlationId, msg.content),
            {noAck: true}
        );
    }
}

module.exports = {
    setup: (channel) => {
        if (!rpcServices) return;
        assert(channel);
        consume(channel);
    }
};