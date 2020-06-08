const {exercise} = require('../models/exercise');
const {mongooseUpdateParams} = require('../../options');

async function create(newExercise) {
    newExercise.number = 1 + await exercise.find({
        themeId: newExercise.themeId,
        difficulty: newExercise.difficulty,
    }).countDocuments();
    let newExerciseModel = new exercise(newExercise);
    return await newExerciseModel.save();
}

async function findByThemeId(themeId, difficulty) {
    return await exercise.find({themeId, difficulty});
}

async function findById(id) {
    return await exercise.findById(id).select('+tests');
}

async function findByIdAndUpdate(id, updateExercise) {
    return await exercise.findByIdAndUpdate(id, updateExercise, mongooseUpdateParams).select('+tests');
}

async function updateMany(findObj, updateObj) {
    return await exercise.updateMany(findObj, updateObj);
}

async function deleteById(id) {
    return await exercise.findByIdAndDelete(id);
}

async function deleteMany(conditionsObj) {
    return await exercise.deleteMany(conditionsObj);
}

module.exports = {
    create,
    findById,
    deleteById,
    updateMany,
    deleteMany,
    findByThemeId,
    findByIdAndUpdate,
};