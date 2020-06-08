const mongoose = require('mongoose');
const exerciseTest = require('./exerciseTest');

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
    language: {
        type: String,
        required: true,
    },
    task: {
        type: String,
        required: true,
    },
    tests: {
        type: [exerciseTest.scheme],
        required: true,
    }
});

module.exports = {
    exercise: mongoose.model('Exercise', exerciseScheme),
    scheme: exerciseScheme
};