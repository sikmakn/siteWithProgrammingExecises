const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {MONGODB_URI} = require('./config');
const {mongoOptions} = require('./options');

mongoose.connect(MONGODB_URI, mongoOptions);
autoIncrement.initialize(mongoose.connection);

const createConnection = require('./amqpHandler');
createConnection();

process.on("SIGINT", () => {
    mongoose.disconnect();
    process.exit();
});