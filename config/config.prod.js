const {
    MONGO_PORT,
    MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DB_NAME
} = process.env;

module.exports = {
    MONGODB_URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_PORT}:${MONGO_HOST}/${MONGO_DB_NAME}?authSource=admin`,
    ADMIN_BEARER: process.env.ADMIN_BEARER,
    COMPILER_URI: process.env.COMPILER_URI,
};