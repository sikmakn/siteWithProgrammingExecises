const theme = require('../models/exercise.js');

async function create(newTheme) {
    return await theme.create(newTheme).exec();
}

async function findThemes(themeForFind, sort = {number: 1}, skip = 0, count) {

    const find = theme.find(theme).sort(sort);

    if (count !== undefined) find.limit(skip + count);

    return await find.exec();
}

async function findById(id) {
    return await theme.findById(id).exec();
}

async function findByIdAndUpdate(id, updateTheme) {
    return await theme.findByIdAndUpdate(id, updateTheme).exec();
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate
};