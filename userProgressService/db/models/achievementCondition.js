const mongoose = require('mongoose');

const achievementCondition = new mongoose.Schema({
    themeId: {
        type: mongoose.ObjectId,
    },
    exerciseId: {
        type: mongoose.ObjectId,
    },
    result: {
        type: String,
    },
    difficulty: {
        type: String,
    },
    count: {
        type: mongoose.Number,
    },
});

module.exports = {
    exercise: mongoose.model('AchievementCondition', achievementCondition),
    scheme: achievementCondition,
};