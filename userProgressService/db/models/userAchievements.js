const mongoose = require('mongoose');

const userAchievements = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
    },
    achievements: [{
        type: mongoose.ObjectId,
    }],
});

module.exports = {
    userAchievements: mongoose.model('UserAchievements', userAchievements),
    scheme: userAchievements,
};