const mongoose = require('mongoose');

const newAchievements = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    achievementIds: {
        type: [mongoose.Types.ObjectId],
        require: true,
    }
});

module.exports = {
    newAchievements: mongoose.model('newAchievement', newAchievements),
    scheme: newAchievements,
};