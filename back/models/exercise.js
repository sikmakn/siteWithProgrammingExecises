const mongoose = require("mongoose");
const exerciseTest = require('./exerciseTest');

const exerciseScheme = new mongoose.Schema({
    difficulty: {
        type: String,
        enum: ['easy', 'middle', 'hard'],
        required: true,
    },
    themeId: {
        type: ObjectId,
        required: true,
    },
    number: {
        type: Number,
        min: 1,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    tests: {
        type: [exerciseTest],
    }
});
module.exports = mongoose.model("exercise", exerciseScheme);