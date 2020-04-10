const themeRepo = require('../db/repositories/themeRepository');

async function create(newTheme) {
    let newThemeModel = await themeRepo.create(newTheme);
    return newThemeModel._doc;
}

async function findThemes(themeForFind, sort = {number: 1}, skip = 0, count) {
    return await themeRepo.findThemes(themeForFind, sort, skip, count);
}

async function findById(id) {
    const theme = await themeRepo.findById(id);
    if (theme === null)
        return theme;
    return theme._doc;
}

async function findByNumber(number) {
    const theme = await themeRepo.findByNumber(number);
    if (theme === null)
        return theme;
    return theme._doc;
}

async function findByIdAndUpdate(id, updateTheme) {
    const res = await themeRepo.findByIdAndUpdate(id, updateTheme);
    if (res === null)
        return res;
    return res._doc;
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate,
    findByNumber,
};