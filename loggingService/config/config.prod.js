const {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME,
} = process.env;

module.exports = {
    MONGODB_URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`,
    AMQP_HOST: process.env.AMQP_HOST,
};