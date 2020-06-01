const themeRepo = require('../db/repositories/themeRepository');

async function create(newTheme) {
    return (await themeRepo.create(newTheme))?._doc;
}

async function findThemes(themeForFind, sort = {number: 1}, count, skip = 0) {
    return await themeRepo.findThemes(themeForFind, sort, count, skip);
}

async function findById(id) {
    return (await themeRepo.findById(id))?._doc;
}

async function findByNumber(number) {
    return (await themeRepo.findByNumber(number))?._doc;
}

async function findByIdAndUpdate(id, updateTheme) {
    return (await themeRepo.findByIdAndUpdate(id, updateTheme))?._doc;
}

module.exports = {
    create,
    findThemes,
    findById,
    findByIdAndUpdate,
    findByNumber,
};