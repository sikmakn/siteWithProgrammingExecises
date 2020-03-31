const express = require("express");
const exerciseService = require('../services/exerciseService');
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const exerciseMapper = require('../Mappers/exerciseMapper');

module.exports = function exerciseController(lang) {
    const router = express.Router();

    router.post('/:themeId/:exerciseId/test', async (req, res) => {
        try {
            console.log(req.body.sourceCode);
            const results = await exerciseService.makeTests(req.params.exerciseId, req.body.sourceCode, lang);
            res.send(results);
        } catch (e) {
            console.error(e);
        }
    });

    router.post('/:themeId/:difficulty', async (req, res) => {
        try {
            let newExercise = exerciseMapper.fromObjToExerciseObj(req.body);
            newExercise.difficulty = req.params.difficulty;
            newExercise.themeId = req.params.themeId;

            const result = await exerciseService.create(newExercise);
            res.send(result);
        } catch (e) {
            console.error(e);
        }
    });

    router.get('/:themeId/:difficulty', async (req, res) => {
        try {
            const theme = await themeService.findById(req.params.themeId);
            const exercises = await exerciseService.findByThemeId(req.params.themeId, req.params.difficulty);
            res.render('exercises.hbs', {
                layout: 'themeSelectMain.hbs',
                isJs: true,
                theme: themeMapper.fromThemeToOutObj(theme),
                exercises: exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex)),
            });
        } catch (err) {
            console.error(err);
        }
    });
    return router;
};
