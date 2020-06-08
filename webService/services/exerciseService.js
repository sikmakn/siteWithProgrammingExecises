const exerciseRepository = require('../db/repositories/exerciceRepository');
const axios = require('axios');
const {COMPILER_URI} = require('../config');
const {langOptions, compilerOptions} = require('../options');

async function makeTests(tests, language, sourceCode) {
    sourceCode = langOptions[language].readLine + sourceCode;
    const results = tests.map(test => makeTest(sourceCode, language, test));
    return Promise.all(results);
}

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

async function create(newExercise) {
    return (await exerciseRepository.create(newExercise))?._doc;
}

async function findById(id) {
    return (await exerciseRepository.findById(id))?._doc;
}

async function findByThemeId(themeId, difficulty) {
    return await exerciseRepository.findByThemeId(themeId, difficulty);
}

async function findByIdAndUpdate(id, updateTheme) {
    return (await exerciseRepository.findByIdAndUpdate(id, updateTheme))?._doc;
}

module.exports = {
    create,
    findById,
    findByIdAndUpdate,
    findByThemeId,
    makeTests,
};