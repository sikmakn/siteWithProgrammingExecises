const theme = require('../models/theme.js').model;

async function create(newTheme) {
    let newThemeModel = new theme(newTheme);
    return await newThemeModel.save();
}

async function findThemes(themeForFind, sort = {number: 1}, skip = 0, count) {
    const find = theme.find(theme).sort(sort);
    if (count !== undefined)
        find.limit(skip + count);
    return await find;
}

async function findById(id) {
    return await theme.findById(id);
}

async function findByIdAndUpdate(id, updateTheme) {
    return await theme.findByIdAndUpdate(id, updateTheme);
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate,
};