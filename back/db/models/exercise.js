const mongoose = require("mongoose");
const exerciseTest = require('./exerciseTest');
const autoIncrement = require('mongoose-auto-increment');

const exerciseScheme = new mongoose.Schema({
    difficulty: {
        type: String,
        enum: ['easy', 'middle', 'hard'],
        required: true,
    },
    themeId: {
        type: mongoose.ObjectId,
        required: true,
    },
    number: {
        type: mongoose.Number,
        min: 1,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    tests: {
        type: [exerciseTest.scheme],
    }
});
exerciseScheme.plugin(autoIncrement.plugin, {model: 'Exercise', field: 'number',});
module.exports = {
    model: mongoose.model("Exercise", exerciseScheme),
    scheme: exerciseScheme
};