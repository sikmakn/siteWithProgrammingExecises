async function start() {
    const {reconnect} = require('./amqpHandler');
    await reconnect();
}

start();