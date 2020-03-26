const exercise = require('../models/exercise').model;

async function create(newExercise) {
    return await exercise.create(newExercise);
}

async function findByThemeId(themeId, difficulty) {
    const res = difficulty !== undefined ?
        exercise.find({themeId, difficulty}) :
        exercise.find({themeId});
    return await res.select('+tests').select('+theme').exec();
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