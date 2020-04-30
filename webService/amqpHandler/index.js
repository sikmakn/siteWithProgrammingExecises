const amqp = require('amqplib/callback_api');
const {rpcServiceName} = require('../options');
const bufferMapper = require('../helpers/objBufferMapper');
const controllers = require('../controllers');
const {AMQP_HOST} = require('../config');

function createConnection() {
    amqp.connect(AMQP_HOST, function (error, connection) {
        if (error) throw error;//todo

        connection.on("error", function (err) {
            if (err.message !== "Connection closing")
                console.error("[AMQP] conn error", err.message); //todo to logs
        });

        connection.on("close", function () {
            console.error("[AMQP] reconnecting"); //todo to logs
            return setTimeout(createConnection, 1000);
        });

        connection.createConfirmChannel((error, channel) => {
            if (error) throw error;//todo

            consume(channel);
        })
    });
}

function consume(channel) {
    setupConsume(channel);
    channel.consume(rpcServiceName, (msg) => {
        const {controller: controllerName, route: routeName, message} = bufferMapper.bufferToObj(msg.content);
        const {replyTo, correlationId} = msg.properties;
        const makeAnswer = (answer) => sendAnswer(answer, channel, replyTo, correlationId);
        const controller = controllers.find(cr => cr.name === controllerName);
        if (!controller) return;

        const route = controller.methods.find(m => m.name === routeName).method;
        if (!route) return;

        route(message, makeAnswer);
        channel.ack(msg);
    });
}

function setupConsume(channel) {
    channel.assertQueue(rpcServiceName, {
        durable: false
    });
    channel.prefetch(1);
}

function sendAnswer(answer, channel, replyTo, correlationId) {
    answer = bufferMapper.objToBuffer(answer);
    channel.sendToQueue(
        replyTo,
        answer,
        {correlationId}
    );
}

module.exports = createConnection;