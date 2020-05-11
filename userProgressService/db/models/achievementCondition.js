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
        enum: ['correct', 'incorrect', 'error'],
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

/*
themeId (+ count (+result + difficulty))
exerciseId  (+ result + difficulty)
*/