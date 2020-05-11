const mongoose = require('mongoose');
const achievementCondition = require('./achievementCondition');
const achievementScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    conditions: {
        type: [achievementCondition.scheme],
        required: true,
    },
    fileId: {
        type: mongoose.ObjectId,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

module.exports = {
    achievement: mongoose.model('Achievement', achievementScheme),
    scheme: achievementScheme,
};