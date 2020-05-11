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

async function findAchievementFile(fileImg) {
    return await achievementRepository.findAchievementFile(fileImg);
}

async function findAchievements({achievementFotFind, count, sort = {number: 1}, skip = 0}) {
    return await achievementRepository.findAchievements({achievementFotFind, count, sort, skip});
}

async function updateById({id, conditions, descriptions, name}) {
    const updatedAchievement = await achievementRepository.updateAchievement({id, conditions, descriptions, name});
    await userAchievementService.addByConditions(conditions);
    return updatedAchievement._doc;
}

async function updateAchievementFile({fileId, file}) {
    return await achievementRepository.updateAchievementFile({fileId, file});
}

module.exports = {
    create,
    findById,
    updateById,
    findAchievements,
    findAchievementFile,
    updateAchievementFile,
};