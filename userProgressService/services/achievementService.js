const achievementRepository = require('../db/repositories/achievementRepository');
const userAchievementService = require('./userAchievementService');

async function create({file, conditions, description, name}) {
    let newAchievement = await achievementRepository.create({file, conditions, description, name});
    await userAchievementService.addByConditions(conditions);
    return newAchievement._doc;
}

async function findById(id) {
    const achievement = await achievementRepository.findById(id);
    return achievement._doc;
}

async function findFile(fileImg) {
    return await achievementRepository.findFile(fileImg);
}

async function findMany({achievementFotFind, count, sort = {number: 1}, skip = 0}) {
    return await achievementRepository.findMany({achievementFotFind, count, sort, skip});
}

async function updateById({id, conditions, description, name}) {
    const updatedAchievement = await achievementRepository.updateAchievement({id, conditions, description, name});
    await userAchievementService.addByConditions(conditions);
    return updatedAchievement._doc;
}

async function updateFile({fileId, file}) {
    return await achievementRepository.updateFile({fileId, file});
}

module.exports = {
    create,
    findById,
    updateById,
    findMany,
    findFile,
    updateFile,
};