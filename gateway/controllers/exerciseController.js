const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices, pubExchanges} = require('../options');
const {rpcQueues, publish} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const progressServiceRPC = rpcQueues[rpcServices.PROGRESS_SERVICE.serviceName];
const webServiceControllers = rpcServices.WEB_SERVICE.controllers;
const progressServiceControllers = rpcServices.PROGRESS_SERVICE.controllers;

const router = express.Router();

router.post('/:exerciseId/test', asyncHandler(async (req, res) => {
    const {sourceCode, themeId, difficulty} = req.body;
    const results = await webServiceRPC[webServiceControllers.exercise]('testById', {
        sourceCode,
        id: req.params.exerciseId,
    });
    //todo if username from auth
    await publish(pubExchanges.exerciseTests, {
        exerciseId: req.params.exerciseId,
        username: 'user',
        sourceCode,
        results,
        themeId,
        difficulty,
    });
    res.json(results);
}));

router.patch('/:id', asyncHandler(async (req, res) => {
    const updatedExercise = await webServiceRPC[webServiceControllers.exercise]('updateById', {
        id: req.params.id,
        exercise: req.body,
    });
    res.json(updatedExercise);
}));

router.post('/', asyncHandler(async (req, res) => {
    const exercise = await webServiceRPC[webServiceControllers.theme]('create', req.body);
    res.json(exercise);
}));

router.get('/:themeId/:difficulty', asyncHandler(async (req, res) => {
    const {themeId, difficulty} = req.params;
    const theme = await webServiceRPC[webServiceControllers.theme]('getById', {id: themeId});
    const exercises = await webServiceRPC[webServiceControllers.exercise]('getByThemeId', {themeId, difficulty});

    //todo if username from auth
    const results = await progressServiceRPC[progressServiceControllers.exerciseResult]('get', {
        username: 'user',
        themeId,
        difficulty,
    });
    exercises.forEach(ex => {
        const oldResult = ({result, sourceCode}) => ({result, sourceCode});
        const result = results.find(r => r.exerciseId === ex._id);
        if (result) ex.oldResult = oldResult(result);
    });
    res.render('exercises.hbs', {
        layout: 'themeSelectMain.hbs',
        isJs: true,
        difficulty: req.params.difficulty,
        theme,
        exercises,
    });
}));

router.get('/sourceCode/:exerciseId', asyncHandler(async (req, res) => {
    //todo if username from auth
    const {sourceCode} = progressServiceRPC[progressServiceControllers.exerciseResult]('getByUsernameAndExerciseId', {
        exerciseId: req.params.exerciseId,
        username: 'user',
    });
    res.json(sourceCode || '');
}));

router.get('/:themeId/:difficulty/next', asyncHandler(async (req, res, next) => {
    const {themeId} = req.params;
    switch (req.params.difficulty) {
        case 'easy':
            res.redirect(`/exercises/${themeId}/middle`);
            break;
        case 'middle':
            res.redirect(`/exercises/${themeId}/hard`);
            break;
        case 'hard':
            const {number, language} = await webServiceRPC[webServiceControllers.theme]('getById', {id: themeId});
            const theme = await webServiceRPC[webServiceControllers.theme]('getByNumber', {number: number + 1});
            if (!theme) {
                res.redirect(`/theme/${language}`);
            } else {
                res.redirect(`/exercises/${theme._id}/easy`);
            }
            break;
        default:
            next();
            break;
    }
}));

router.get('/:themeId/:difficulty/prev', asyncHandler(async (req, res, next) => {
    const {themeId} = req.params;
    switch (req.params.difficulty) {
        case 'easy':
            const {number, language} = await webServiceRPC[webServiceControllers.theme]('getById', {id: themeId});
            const theme = await webServiceRPC[webServiceControllers.theme]('getByNumber', {number: number - 1});
            if (!theme) {
                res.redirect(`/theme/${language}`);
            } else {
                res.redirect(`/exercises/${theme._id}/hard`);
            }
            break;
        case 'hard':
            res.redirect(`/exercises/${themeId}/middle`);
            break;
        case 'middle':
            res.redirect(`/exercises/${themeId}/easy`);
            break;
        default:
            next();
            break;
    }
}));

module.exports = router;
