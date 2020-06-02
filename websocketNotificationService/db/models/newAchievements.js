const mongoose = require('mongoose');

const newAchievements = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: true,
    },
    count: {
        type: mongoose.Number,
        require: true,
        min: 1,
    },
});

module.exports = {
    newAchievements: mongoose.model('newAchievement', newAchievements),
    scheme: newAchievements,
};