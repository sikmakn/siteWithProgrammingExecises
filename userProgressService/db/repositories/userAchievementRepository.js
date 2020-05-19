const {userAchievements} = require('../models/userAchievements');
const {mongooseUpdateParams} = require('../../options');

async function addAchievements({username, achievementIds}) {
    return await userAchievements.findOneAndUpdate({username},
        {$push: {'achievements': achievementIds}},
        {upsert: true, ...mongooseUpdateParams});
}

async function addAchievementsToManyUsers(usernames, achievementIds) {
    const usernameQueries = usernames.map(n => ({username: n}));
    return await userAchievements.findOneAndUpdate(
        {$match: {$or: usernameQueries}},
        {$push: {'achievements': achievementIds}},
        {upsert: true, ...mongooseUpdateParams});
}

async function deleteAchievements({username, achievementIds}) {
    return await userAchievements.findOneAndUpdate({username},
        {$pull: {'achievements': achievementIds}},
        mongooseUpdateParams);
}

async function findByUsername(username) {
    return await userAchievements.findOne({username});
}

module.exports = {
    findByUsername,
    addAchievements,
    deleteAchievements,
    addAchievementsToManyUsers,
};