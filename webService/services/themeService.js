const themeRepository = require('../db/repositories/themeRepository');

async function create(newTheme) {
    return await themeRepository.create(newTheme);
}

async function findThemes(themeForFind, sort = {number: 1}, count, skip = 0) {
    return await themeRepository.findThemes(themeForFind, sort, count, skip);
}

async function findById(id) {
    return await themeRepository.findById(id);
}

async function findByNumber(number) {
    return await themeRepository.findByNumber(number);
}

async function findByIdAndUpdate(id, updateTheme) {
    return await themeRepository.findByIdAndUpdate(id, updateTheme);
}

async function deleteById(id) {
    const deleted = await themeRepository.deleteById(id);
    if (!deleted) return deleted;
    const modified = await themeRepository.updateMany({
            number: {$gt: deleted.number},
            language: deleted.language,
        },
        {$inc: {number: -1}});
    return {deleted, modified};
}

module.exports = {
    create,
    findById,
    findThemes,
    deleteById,
    findByNumber,
    findByIdAndUpdate,
};