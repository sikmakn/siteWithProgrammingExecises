const exerciseResultRepository = require('../db/repositories/exerciseResultRepository');

async function findOneAndUpdate({findParams, updatedExercise, results}) {
    updatedExercise.result = findCommonResult(results);
    const result = await exerciseResultRepository.findOneAndUpdate({findParams, updatedExercise});
    return result._doc;
}

function findCommonResult(results) {
    if (results.find(r => r.result === 'error')) return 'error';
    if (results.find(r => r.result === 'incorrect')) return 'incorrect';
    return 'correct';
}

async function findByThemeId({username, themeId, difficulty}) {
    const findParams = {username, themeId};
    if (difficulty) findParams.difficulty = difficulty;
    return await exerciseResultRepository.find(findParams);
}

async function findByExerciseId({username, exerciseId, difficulty}) {
    const findParams = {username, exerciseId};
    if (difficulty) findParams.difficulty = difficulty;
    return await exerciseResultRepository.find(findParams);
}

async function findByIdAndUpdate(id, updateExercise) {
    const result = await exerciseResultRepository.findByIdAndUpdate(id, updateExercise);
    return result._doc;
}

async function findByConditions(conditions) {
    return await exerciseResultRepository.findByConditions(conditions);
}

async function findByUsername(username) {
    return await exerciseResultRepository.find({username});
}

module.exports = {
    findByThemeId,
    findByExerciseId,
    findOneAndUpdate,
    findByIdAndUpdate,
    findByConditions,
    findByUsername,
};