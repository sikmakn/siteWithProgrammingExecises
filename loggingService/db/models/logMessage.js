const mongoose = require('mongoose');
const logMessageScheme = new mongoose.Schema({
    message: {
        type: Object,
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    }
});

module.exports = {
    logMessage: mongoose.model('logMessage', logMessageScheme),
    scheme: logMessageScheme,
};