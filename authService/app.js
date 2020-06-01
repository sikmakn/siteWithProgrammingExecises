const mongoose = require('mongoose');
const {MONGODB_URI} = require('./config');
const {mongoOptions} = require('./options');
const {startRemoveExpiresSchedule} = require('./services/authService');

async function start() {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    const {reconnect} = require('./amqpHandler');
    await reconnect();
    await startRemoveExpiresSchedule();
}

start();

process.on("SIGINT", () => {
    process.exit();
});