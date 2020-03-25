const themeRepo = require('../db/repositories/themeRepository');

async function create(newTheme) {
    let newThemeModel = await themeRepo.create(newTheme);
    return newThemeModel._doc;
}

async function findThemes(themeForFind, sort = {number: 1}, skip = 0, count) {
    const themes = await themeRepo.findThemes(themeForFind, sort, skip, count);
    return themes.map(el => el._doc);
}

async function findById(id) {
    const theme = await themeRepo.findById(id);
    return theme._doc;
}

async function findByIdAndUpdate(id, updateTheme) {
    const res = await themeRepo.findByIdAndUpdate(id, updateTheme);
    return res._doc;
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate,
};