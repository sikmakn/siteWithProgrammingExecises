const exerciseRepository = require('../db/repositories/exerciceRepository');
const themeRepository = require('../db/repositories/themeRepository');
const axios = require('axios');
const {COMPILER_URI} = require('../config');
const {langOptions} = require('../options');

async function makeTests(id, sourceCode) {
    const {tests, language} = await exerciseRepository.findById(id);
    sourceCode = langOptions[language].readLine + sourceCode;
    const results = [];
    for (let test of tests)
        results.push(makeTest(sourceCode, language, test));

    return results;
}

async function makeTest(sourceCode, language, test) {
    if (test.additionalCode) sourceCode += test.additionalCode;

    const stdin = test.input.join('\n');
    let result = await axios.post(COMPILER_URI, {
        language_id: langOptions[language].languageId,
        expected_output: test.output,
        source_code: sourceCode,
        wait: "true",
        stdin,
    });
    return {
        description: result.data.status.description,
        resultId: result.data.status.id,
        stdout: result.data.stdout,
        stdin,
    };
}


async function create(newExercise) {
    const theme = await themeRepository.findById(newExercise.themeId);
    if (!theme) throw new Error('Theme is not exist');
    newExercise.language = theme.language;
    let newExerciseModel = await exerciseRepository.create(newExercise);
    return newExerciseModel._doc;
}

async function findById(id) {
    const theme = await exerciseRepository.findById(id);
    return theme._doc;
}

async function findByThemeId(themeId, difficulty) {
    const theme = await exerciseRepository.findByThemeId(themeId, difficulty);
    return theme.map(th => th._doc);
}

async function findByIdAndUpdate(id, updateTheme) {
    const res = await exerciseRepository.findByIdAndUpdate(id, updateTheme);
    return res._doc;
}

module.exports = {
    create,
    findById,
    findByIdAndUpdate,
    findByThemeId,
    makeTests,
};