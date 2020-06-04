const bufferMapper = require('../../helpers/objBufferMapper');
const {rpcServiceName} = require('../../options');

function setupConsume(channel, rpcControllers) {
    channel.assertQueue(rpcServiceName, {durable: false});
    channel.prefetch(1);
    consume(channel, rpcControllers);
}

function consume(channel, rpcControllers) {
    channel.consume(rpcServiceName, (msg) => {
        const {controller: controllerName, route: routeName, message} = bufferMapper.bufferToObj(msg.content);
        const {replyTo, correlationId} = msg.properties;
        const makeAnswer = (answer) =>
            sendAnswer(answer, channel, replyTo, correlationId);
        const controller = rpcControllers.find((cr) => cr.name === controllerName);
        if (!controller) {
            makeAnswer({error: new Error('controller is not defined')});
            return;
        }

        const fullMethod = controller.methods.find((m) => m.name === routeName);
        if (!fullMethod) {
            makeAnswer({error: new Error('method is not defined')});
            return;
        }

        const result = fullMethod.method(message, makeAnswer, channel);
        if (result instanceof Promise) {
            result.then(() => channel.ack(msg));
        } else {
            channel.ack(msg);
        }
    });
}

function sendAnswer(answer, channel, replyTo, correlationId) {
    answer = bufferMapper.objToBuffer(answer);
    channel.sendToQueue(replyTo, answer, {correlationId});
}

module.exports = {
    setup: (channel) => {
        if (!rpcServiceName) return;
        const rpcControllers = require('../../rpcControllers');
        setupConsume(channel, rpcControllers);
    }
};