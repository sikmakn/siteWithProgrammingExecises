const achievementRepository = require('../db/repositories/achievementRepository');

async function create({file, conditions, description, name}) {
    return (await achievementRepository.create({file, conditions, description, name}))?._doc;
}

async function findById(id) {
    return (await achievementRepository.findById(id))?._doc;
}

async function findFile(fileImg) {
    return await achievementRepository.findFile(fileImg);
}

async function findMany({achievementForFind, count, sort = {name: 1}, skip = 0}) {
    return await achievementRepository.findMany({achievementForFind, count, sort, skip});
}

async function updateById({id, conditions, description, name}) {
    return (await achievementRepository.updateAchievement({id, conditions, description, name}))?._doc;
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