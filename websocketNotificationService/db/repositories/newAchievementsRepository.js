const {newAchievements} = require('../models/newAchievements');
const {mongooseUpdateParams} = require('../../options');

async function create({userId, count}) {
    const newAchievementModel = new newAchievements({userId, count});
    return await newAchievementModel.save();
}

async function findMany({userIds}) {
    const query = userIds.map(userId => ({userId}));
    return await newAchievements.find({$or: query})
}

async function findByUserId(userId) {
    return await newAchievements.findOne({userId});
}

async function createOrUpdateMany(queryObjArr) {
    return await newAchievements.bulkWrite(queryObjArr, {ordered: false});
}

async function update({userId, updateQuery}) {
    return await newAchievements.updateOne({userId}, updateQuery, mongooseUpdateParams);
}

async function deleteByUserId(userId) {
    return await newAchievements.deleteOne({userId});
}

module.exports = {
    findMany,
    create,
    update,
    findByUserId,
    deleteByUserId,
    createOrUpdateMany,
};