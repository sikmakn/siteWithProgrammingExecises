const mongoose = require("mongoose");

const exerciseTestScheme = new mongoose.Schema({
    input: {
        type: [String],
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("exerciseTest", exerciseTestScheme);