const {userAchievements} = require('../models/userAchievements');
const {mongooseUpdateParams} = require('../../options');

async function addAchievement({username, achievementIds}) {
    return await userAchievements.findOneAndUpdate({username},
        {$push: {'achievements': achievementIds}},
        {
            upsert: true,
            ...mongooseUpdateParams
        });
}

async function deleteAchievement({username, achievementIds}) {
    return await userAchievements.findOneAndUpdate({username},
        {$pull: {'achievements': achievementIds}},
        mongooseUpdateParams);
}

async function findByUsername(username) {
    return await userAchievements.findOne({username});
}

module.exports = {
    findByUsername,
    addAchievement,
    deleteAchievement,
};