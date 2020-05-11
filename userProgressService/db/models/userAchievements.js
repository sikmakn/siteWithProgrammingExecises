const mongoose = require('mongoose');

const userAchievements = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    achievements: [{
        type: mongoose.ObjectId,
        ref: 'Achievement',
    }],
});

module.exports = {
    exercise: mongoose.model('UserAchievements', userAchievements),
    scheme: userAchievements,
};