const exerciseRepository = require('../db/repositories/exerciceRepository');
const axios = require('axios');
const {COMPILER_URI} = require('../config');
const {langOptions, compilerOptions} = require('../options');

async function makeTests(tests, language, sourceCode) {
    sourceCode = langOptions[language].readLine + sourceCode;
    const results = tests.map(test => makeTest(sourceCode, language, test));
    return Promise.all(results);
}

async function create(newExercise) {
    return await exerciseRepository.create(newExercise);
}

async function findById(id) {
    return await exerciseRepository.findById(id);
}

async function findByThemeId(themeId, difficulty) {
    return await exerciseRepository.findByThemeId(themeId, difficulty);
}

async function findByIdAndUpdate(id, updateTheme) {
    return await exerciseRepository.findByIdAndUpdate(id, updateTheme);
}

async function deleteById(id) {
    const deleted = await exerciseRepository.deleteById(id);
    if (!deleted) return deleted;
    const modified = await exerciseRepository.updateMany({
            number: {$gt: deleted.number},
            themeId: deleted.themeId,
        },
        {$inc: {number: -1}});
    return {deleted, modified};
}

async function deleteManyByThemeId(themeId){
    return await exerciseRepository.deleteMany({themeId})
}

module.exports = {
    create,
    findById,
    makeTests,
    deleteById,
    findByThemeId,
    findByIdAndUpdate,
    deleteManyByThemeId,
};

async function makeTest(sourceCode, language, test) {
    const {additionalCode, output, input} = test;
    if (additionalCode) sourceCode += additionalCode;

    const stdin = input.join('\n');
    let {data} = await axios.post(COMPILER_URI, {
        language_id: langOptions[language].languageId,
        expected_output: output,
        source_code: sourceCode,
        wait: "true",
        stdin,
    });
    return {resultName: getResultName(data?.status.id), stdout: data?.stdout, stdin};
}

function getResultName(statusId) {
    return compilerOptions[statusId] ?? compilerOptions.default;
}