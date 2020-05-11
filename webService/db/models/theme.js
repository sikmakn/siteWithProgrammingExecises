const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

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
    }
});
themeScheme.plugin(autoIncrement.plugin, {
    model: 'Theme',
    field: 'number',
    startAt: 1,
    incrementBy: 1,
});

module.exports = {
    theme: mongoose.model('Theme', themeScheme),
    scheme: themeScheme,
};