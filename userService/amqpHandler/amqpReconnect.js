const {AMQP_HOST} = require('../config');
const amqp = require('amqplib');
const setupChannel = require('./setupChannel');

let producingChannel;
let connection;

async function reconnect() {
    await createConnection();
    await createChannel();
}

function makeConnectionReconnect() {
    connection.on("close", function () {
        console.error("[AMQP] reconnecting"); //todo to logs
        return setTimeout(reconnect, 1000);
    });
}

async function createConnection() {
    connection = await amqp.connect(AMQP_HOST);

    connection.on("error", function (err) {
        if (err.message !== "Connection closing")
            console.error("[AMQP] conn error", err.message); //todo to logs
    });
    makeConnectionReconnect();
}

async function createChannel() {
    producingChannel = await connection.createConfirmChannel();
    setupChannel(producingChannel);
}

async function getChannel() {
    if (!connection) await reconnect();

    return producingChannel;
}

module.exports = {
    reconnect,
    getChannel,
};