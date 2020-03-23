const mongoose = require("mongoose");
const autoIncrement = require('mongoose-auto-increment');

const themeScheme = new mongoose.Schema({
    language: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        min: 1,
    },
    name: {
        type: String,
        required: true,
    },
});
themeScheme.plugin(autoIncrement.plugin, {model: 'theme', field: 'number'});

module.exports = mongoose.model("theme", themeScheme);