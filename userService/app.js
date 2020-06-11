const mongoose = require('mongoose');
const {MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_MAIL} = require('./config');
const {mongoOptions} = require('./options');
const userService = require('./services/userService');

async function start() {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    if (!await userService.findByUsername(ADMIN_USERNAME))
        await userService.create({
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD,
            role: 'admin',
            email: ADMIN_MAIL,
            isBlocked: false,
        });
    const {reconnect} = require('./amqpHandler');
    await reconnect();
}

start();

process.on("SIGINT", () => {
    mongoose.disconnect().then(() => {
        process.exit();
    });
});