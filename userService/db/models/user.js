const mongoose = require('mongoose');
const userScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['admin', 'free', 'paid'],
    },
    isBlocked: {
        required: true,
        type: Boolean,
    },
});

module.exports = {
    user: mongoose.model('User', userScheme),
    scheme: userScheme,
};