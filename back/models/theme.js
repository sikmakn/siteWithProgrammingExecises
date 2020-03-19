const mongoose = require("mongoose");

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
module.exports = mongoose.model("theme", themeScheme);