const exerciseRepository = require('../db/repositories/exerciceRepository');
const axios = require('axios');

const langOptions = {
    'js': {
        readLine: `fs=require('fs');
            let params = fs.readFileSync('/dev/stdin')
                .toString().split("\\n");
             let count = 0;
            const readLine = ()=> params[count++];`,
        languageId: 63,
    },
};

async function makeTests(id, sourceCode, lang) {
    sourceCode = langOptions[lang].readLine + sourceCode;
    const exercise = await exerciseRepository.findById(id);
    const results = {};
    for (let test of exercise.tests) {
        const stdIn = test.input.join('\n');
        let result = await axios.post('http://localhost:3000/submissions/', {
            language_id: langOptions[lang].languageId,
            wait: "true",
            source_code: sourceCode,
            stdin: stdIn,
            expected_output: test.output,
        });
        results[stdIn] = result.data.status;
    }
    return results;
}

async function create(newExercise) {
    let newThemeModel = await exerciseRepository.create(newExercise);
    return newThemeModel._doc;
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