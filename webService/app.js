const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const {MONGODB_URI} = require('./config');
const {mongoOptions} = require('./options');

async function start() {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    autoIncrement.initialize(mongoose.connection);

    const {reconnect} = require('./amqpHandler');
    await reconnect();
}

start();

process.on("SIGINT", () => {
    mongoose.disconnect().then(()=>{
        process.exit();
    });
});