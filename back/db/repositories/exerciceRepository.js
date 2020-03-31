const exercise = require('../models/exercise').model;

async function create(newExercise) {
    let newExerciseModel = new exercise(newExercise);
    return await newExerciseModel.save();
}

async function findByThemeId(themeId, difficulty) {
    const res = difficulty === undefined ?
        exercise.find({themeId}) :
        exercise.find({themeId, difficulty});
    return await res;
}

async function findById(id) {
    return await exercise.findById(id).select('+tests');
}

async function findByIdAndUpdate(id, updateExercise) {
    return await exercise.findByIdAndUpdate(id, updateExercise).select('+tests');
}

module.exports = {
    create,
    findById,
    findByThemeId,
    findByIdAndUpdate
};