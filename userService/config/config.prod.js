const {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME,
} = process.env;

module.exports = {
    AMQP_HOST: process.env.AMQP_HOST,
    MONGODB_URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`,
    STATIC_SALT: process.env.STATIC_SALT,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_MAIL: process.env.ADMIN_MAIL,
};