const mongoose = require('mongoose');
const authDataScheme = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    fingerPrint: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    }
});

module.exports = {
    authData: mongoose.model('authData', authDataScheme),
    scheme: authDataScheme,
};