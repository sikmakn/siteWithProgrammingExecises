const achievementRepository = require('../db/repositories/achievementRepository');

async function create({file, conditions, description, name, previewFile}) {
    return (await achievementRepository.create({file, conditions, description, name, previewFile}))?._doc;
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

async function findManyByIds(ids) {
    const matchIds = ids.map(id => ({_id: id}));
    return await achievementRepository.findMany({achievementForFind: {$or: matchIds}});
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
    findManyByIds,
};