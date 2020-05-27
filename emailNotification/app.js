async function start() {
    const {reconnect} = require('./amqpHandler');
    await reconnect();

    await require('./subControllers/emailController')();
}

start();