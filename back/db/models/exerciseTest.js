const mongoose = require("mongoose");
const exerciseTestScheme = new mongoose.Schema({
    input: {
        type: [String],
    },
    additionalCode: {
        type: String,
    },
    output: {
        type: String,
        required: true,
    },
});
module.exports = {
    model: mongoose.model("ExerciseTest", exerciseTestScheme),
    scheme: exerciseTestScheme
};