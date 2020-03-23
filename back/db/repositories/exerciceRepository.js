const exercise = require('../models/exercise');

async function create(newExercise) {
    return await exercise.create(newExercise).exec();
}

async function findByThemeId(themeId) {
    return await exercise.find({themeId}).select('+tests').exec();
}

async function findById(id) {
    return await exercise.findById(id).select('+tests').exec();
}

async function findByIdAndUpdate(id, updateExercise) {
    return await exercise.findByIdAndUpdate(id, updateExercise).select('+tests').exec();
}

module.exports = {
    create,
    findById,
    findByThemeId,
    findByIdAndUpdate
};