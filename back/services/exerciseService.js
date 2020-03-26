const exerciseRepository = require('../db/repositories/exerciceRepository');

async function create(newTheme) {
    let newThemeModel = await exerciseRepository.create(newTheme);
    return newThemeModel._doc;
}

async function findThemes(themeForFind, sort = {number: 1}, skip = 0, count) {
    const themes = await exerciseRepository.findThemes(themeForFind, sort, skip, count);
    return themes.map(el => el._doc);
}

async function findById(id) {
    const theme = await exerciseRepository.findById(id);
    return theme._doc;
}

async function findByThemeId(themeId, difficulty) {
    const theme = await exerciseRepository.findByThemeId(themeId, difficulty);
    return theme._doc;
}

async function findByIdAndUpdate(id, updateTheme) {
    const res = await exerciseRepository.findByIdAndUpdate(id, updateTheme);
    return res._doc;
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate,
    findByThemeId,
};