const exerciseRepository = require('../db/repositories/exerciceRepository');
const themeRepository = require('../db/repositories/themeRepository');
const axios = require('axios');
const {COMPILER_URI} = require('../config');
const {langOptions} = require('../options');

async function makeTests(id, sourceCode, lang) {
    const exercise = await themeRepository.findById(id);
    sourceCode = langOptions[exercise.language].readLine + sourceCode;
    const results = [];
    for (let test of exercise.tests) {
        let fullSourceCode = sourceCode;
        if (test.additionalCode) fullSourceCode += test.additionalCode;

        const stdin = test.input.join('\n');
        let result = await axios.post(COMPILER_URI, {
            language_id: langOptions[lang].languageId,
            wait: "true",
            source_code: fullSourceCode,
            stdin,
            expected_output: test.output,
        });
        results.push({
            resultId: result.data.status.id,
            stdin,
            description: result.data.status.description,
            stdout: result.data.stdout,
        });
    }
    return results;
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