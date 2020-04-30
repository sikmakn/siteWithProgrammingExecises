const {AMQP_HOST} = require("../config");
const amqp = require("amqplib");
const setupChannel = require('./setupChannel');

let producingChannel;
let connection;

async function reconnect() {
    connection = createConnection();
    producingChannel = await connection.createConfirmChannel();
    await setupChannel(producingChannel);
}

function makeConnectionReconnect() {
    connection.on("close", function () {
        console.error("[AMQP] reconnecting"); //todo to logs
        return setTimeout(() => reconnect(setupChannel), 1000);
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
    await setupChannel(producingChannel);
}

async function getChannel() {
    if (!connection) {
        await createConnection();
        await createChannel();
    }
    return producingChannel;
}

module.exports = {
    getChannel,
};