const {newAchievements} = require('../models/newAchievements');
const {mongooseUpdateParams} = require('../../options');

async function create({userId, count}) {
    const newAchievementModel = new newAchievements({userId, count});
    return await newAchievementModel.save();
}

async function findByUserId(userId) {
    return await newAchievements.findOne({userId});
}

async function update({userId, count}) {
    return await newAchievements.updateOne({userId}, {count}, mongooseUpdateParams);
}

async function deleteByUserId(userId) {
    return await newAchievements.deleteOne({userId});
}

module.exports = {
    create,
    update,
    findByUserId,
    deleteByUserId,
};