const express = require("express");
const asyncHandler = require('express-async-handler');

module.exports = function exerciseController() {
    const router = express.Router();

    router.post('/:themeId/:exerciseId/test', asyncHandler(async (req, res, next) => {
        next();
    }));

    router.post('/:themeId/:difficulty', asyncHandler(async (req, res, next) => {
        next();
    }));

    router.get('/:themeId/:difficulty', asyncHandler(async (req, res, next) => {
        // res.render('exercises.hbs', {
        //     layout: 'themeSelectMain.hbs',
        //     isJs: true,
        //     difficulty: req.params.difficulty,
        //     theme: themeMapper.fromThemeToOutObj(theme),
        //     exercises: exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex)),
        // });
        next();
    }));

    router.get('/:themeId/:difficulty/next', asyncHandler(async (req, res, next) => {
        next();
    }));

    router.get('/:themeId/:difficulty/prev', asyncHandler(async (req, res, next) => {
        next();
    }));


    return router;
};
