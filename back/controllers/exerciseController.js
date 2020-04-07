const express = require("express");
const exerciseService = require('../services/exerciseService');
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const exerciseMapper = require('../Mappers/exerciseMapper');

module.exports = function exerciseController(lang) {
    const router = express.Router();

    router.post('/:themeId/:exerciseId/test', async (req, res) => {
        try {
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
                difficulty: req.params.difficulty,
                theme: themeMapper.fromThemeToOutObj(theme),
                exercises: exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex)),
            });
        } catch (e) {
            console.error(e);
        }
    });

    router.get('/:themeId/:difficulty/next', async (req, res) => {
        try {
            let difficulty;
            switch (req.params.difficulty) {
                case 'easy':
                    difficulty = 'middle';
                    res.redirect(`../../${req.params.themeId}/${difficulty}`);
                    break;
                case 'middle':
                    difficulty = 'hard';
                    res.redirect(`../../${req.params.themeId}/${difficulty}`);
                    break;
                case 'hard':
                    difficulty = 'easy';
                    let theme = await themeService.findById(req.params.themeId);
                    let newTheme = await themeService.findByNumber(theme.number + 1);
                    if (newTheme === null) {
                        res.redirect(`/${lang}`);
                    } else {
                        res.redirect(`../../${newTheme._id}/${difficulty}`);
                    }
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    });

    router.get('/:themeId/:difficulty/prev', async (req, res) => {
        try {

            let difficulty;
            switch (req.params.difficulty) {
                case 'easy':
                    let theme = await themeService.findById(req.params.themeId);
                    let newTheme = await themeService.findByNumber(theme.number - 1);
                    if (newTheme === null) {
                        res.redirect(`/${lang}`);
                    } else {
                        difficulty = 'hard';
                        res.redirect(`../../${newTheme.themeId}/${difficulty}`);
                    }
                    break;
                case 'hard':
                    difficulty = 'middle';
                    res.redirect(`../../${req.params.themeId}/${difficulty}`);
                    break;
                case 'middle':
                    difficulty = 'easy';
                    res.redirect(`../../${req.params.themeId}/${difficulty}`);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    });


    return router;
};
