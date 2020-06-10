const {theme} = require('../models/theme');
const {mongooseUpdateParams} = require('../../options');

async function create(newTheme) {
    newTheme.number = 1 + await theme.find({language: newTheme.language}).countDocuments();
    let newThemeModel = new theme(newTheme);
    return await newThemeModel.save();
}

async function findThemes(themeForFind, sort, count, skip) {
    const find = theme.find(themeForFind).sort(sort);
    if (count !== undefined)
        find.limit(skip + count);
    return await find;
}

async function findById(id) {
    return await theme.findById(id);
}

async function updateMany(findObj, updateObj) {
    return await theme.updateMany(findObj, updateObj);
}

async function findByIdAndUpdate(id, updateTheme) {
    return await theme.findByIdAndUpdate(id, updateTheme, mongooseUpdateParams);
}

async function findByNumber(number) {
    return await theme.findOne({number});
}

async function deleteById(id) {
    return await theme.findByIdAndDelete(id);
}

module.exports = {
    create,
    findById,
    findThemes,
    deleteById,
    updateMany,
    findByNumber,
    findByIdAndUpdate,
};