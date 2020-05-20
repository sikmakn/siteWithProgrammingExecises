const bufferMapper = require('../helpers/objBufferMapper');
const controllers = require('../controllers');
const {rpcServiceName} = require('../options');

function setupChannel(channel) {
    consumeQueues(channel);
}

function consumeQueues(channel) {
    setupConsume(channel);
    consume(channel);
}

function setupConsume(channel) {
    channel.assertQueue(rpcServiceName, {
        durable: false
    });
    channel.prefetch(1);
}

function consume(channel) {
    setupConsume(channel);
    channel.consume(rpcServiceName, (msg) => {
        const {controller: controllerName, route: routeName, message} = bufferMapper.bufferToObj(msg.content);
        const {replyTo, correlationId} = msg.properties;
        const makeAnswer = (answer) => sendAnswer(answer, channel, replyTo, correlationId);
        const controller = controllers.find(cr => cr.name === controllerName);
        if (!controller) return;

        const fullMethod = controller.methods.find(m => m.name === routeName);
        if (!fullMethod) return;

        const result = fullMethod.method(message, makeAnswer);
        if (result instanceof Promise) {
            result.then(() => channel.ack(msg));
        } else {
            channel.ack(msg);
        }
    });
}

function sendAnswer(answer, channel, replyTo, correlationId) {
    answer = bufferMapper.objToBuffer(answer);
    channel.sendToQueue(
        replyTo,
        answer,
        {correlationId}
    );
}

module.exports = setupChannel;