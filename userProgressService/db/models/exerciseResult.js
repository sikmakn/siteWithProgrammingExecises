const mongoose = require('mongoose');

const exerciseResultScheme = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    themeId: {
        type: mongoose.ObjectId,
        required: true,
    },
    exerciseId: {
        type: mongoose.ObjectId,
        required: true,
    },
    sourceCode: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        enum: ['correct', 'incorrect', 'error'],
        required: true,
    },
});

module.exports = {
    exerciseResult: mongoose.model('ExerciseResult', exerciseResultScheme),
    scheme: exerciseResultScheme,
};