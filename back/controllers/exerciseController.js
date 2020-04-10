const express = require("express");
const exerciseService = require('../services/exerciseService');
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const exerciseMapper = require('../Mappers/exerciseMapper');
const asyncHandler = require('express-async-handler');

module.exports = function exerciseController(lang) {
    const router = express.Router();

    router.post('/:themeId/:exerciseId/test', asyncHandler(async (req, res) => {
        const results = await exerciseService.makeTests(req.params.exerciseId, req.body.sourceCode, lang);
        res.send(results);
    }));

    router.post('/:themeId/:difficulty', asyncHandler(async (req, res) => {
        let newExercise = exerciseMapper.fromObjToExerciseObj(req.body);
        newExercise.difficulty = req.params.difficulty;
        newExercise.themeId = req.params.themeId;

        const result = await exerciseService.create(newExercise);
        res.send(result);
    }));

    router.get('/:themeId/:difficulty', asyncHandler(async (req, res) => {
        const theme = await themeService.findById(req.params.themeId);
        const exercises = await exerciseService.findByThemeId(req.params.themeId, req.params.difficulty);
        res.render('exercises.hbs', {
            layout: 'themeSelectMain.hbs',
            isJs: true,
            difficulty: req.params.difficulty,
            theme: themeMapper.fromThemeToOutObj(theme),
            exercises: exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex)),
        });
    }));

    router.get('/:themeId/:difficulty/next', asyncHandler(async (req, res) => {
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
    }));

    router.get('/:themeId/:difficulty/prev', asyncHandler(async (req, res) => {
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
    }));


    return router;
};
