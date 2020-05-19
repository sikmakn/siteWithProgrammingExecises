const exerciseResultRepository = require('../db/repositories/exerciseResultRepository');

async function findOneAndUpdate({findParams, updatedExercise, results}) {
    updatedExercise.result = findCommonResult(results);
    const result = await exerciseResultRepository.findOneAndUpdate({findParams, updatedExercise});
    return result._doc;
}

function findCommonResult(results) {
    if (results.some(r => r.resultName === 'error')) return 'error';
    if (results.some(r => r.resultName === 'incorrect')) return 'incorrect';
    return 'correct';
}

async function find(findParams) {
    return await exerciseResultRepository.find(findParams);
}

async function aggregate(aggregateConditions = []) {
    return await exerciseResultRepository.aggregate(aggregateConditions);
}

async function findByUsername(username) {
    return await exerciseResultRepository.find({username});
}

module.exports = {
    find,
    findOneAndUpdate,
    aggregate,
    findByUsername,
};