const {objToBuffer} = require('../helpers/objBufferMapper');

module.exports = {
    publish: async (channel, exchange, msg, topic = '') => {
        channel.publish(exchange, topic, objToBuffer(msg));
    },
};
