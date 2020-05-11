const {exerciseResult} = require('../models/exerciseResult');
const {mongooseUpdateParams} = require('../../options');

async function find(findParams) {
    return await exerciseResult.find(findParams);
}

async function findByIdAndUpdate(id, updateExercise) {
    return await exerciseResult.findByIdAndUpdate(id, updateExercise, mongooseUpdateParams);
}

async function findOneAndUpdate({findParams, updatedExercise}) {
    return await exerciseResult.findOneAndUpdate(findParams, updatedExercise, {
        upsert: true,
        ...mongooseUpdateParams
    });
}

async function findByConditions(conditions) {
    return exerciseResult.aggregate([
        {$match: {$or: conditions}},
        {
            $group: {
                _id: "username",
                count: {$sum: 1}
            }
        },
        {
            $sort: {
                username: 1
            }
        },
    ]);
}

module.exports = {
    find,
    findOneAndUpdate,
    findByIdAndUpdate,
    findByConditions,
};