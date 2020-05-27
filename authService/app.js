const mongoose = require('mongoose');
const {MONGODB_URI} = require('./config');
const {mongoOptions} = require('./options');

async function start() {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    const {reconnect} = require('./amqpHandler');
    await reconnect();
}

start();

process.on("SIGINT", () => {
    process.exit();
});