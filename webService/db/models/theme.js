const mongoose = require('mongoose');

const themeScheme = new mongoose.Schema({
    language: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        min: 1,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    theoryLink: {
        type: String,
        required: true,
    }
});

module.exports = {
    theme: mongoose.model('Theme', themeScheme),
    scheme: themeScheme,
};