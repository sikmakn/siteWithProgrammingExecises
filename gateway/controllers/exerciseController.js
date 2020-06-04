const express = require('express');
const asyncHandler = require('express-async-handler');
const {rpcServices, pubExchanges} = require('../options');
const {rpcQueues, publish, getChannel} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const progressServiceRPC = rpcQueues[rpcServices.PROGRESS_SERVICE.serviceName];
const webServiceControllers = rpcServices.WEB_SERVICE.controllers;
const progressServiceControllers = rpcServices.PROGRESS_SERVICE.controllers;
const {decodeToken, adminValidate} = require('../helpers/auth');

const router = express.Router();

router.post('/:exerciseId/test', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {sourceCode, themeId, difficulty} = req.body;
    const {result: results} = await webServiceRPC[webServiceControllers.exercise](channel, 'testById', {
        sourceCode,
        id: req.params.exerciseId,
    });
    if (req.token) {
        const {userId} = await decodeToken(req.token);
        await publish(channel, pubExchanges.exerciseTests, {
            exerciseId: req.params.exerciseId,
            username: userId,
            difficulty,
            sourceCode,
            results,
            themeId,
        });
    }
    res.json(results);
}));

router.patch('/:id', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {result: updatedExercise} = await webServiceRPC[webServiceControllers.exercise](channel, 'updateById', {
        id: req.params.id,
        exercise: req.body,
    });
    res.json(updatedExercise);
}));

router.post('/', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {result: exercise} = await webServiceRPC[webServiceControllers.theme](channel, 'create', req.body);
    res.json(exercise);
}));

router.get('/:themeId/:difficulty', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {themeId, difficulty} = req.params;
    const {result: theme} = await webServiceRPC[webServiceControllers.theme](channel, 'getById', {id: themeId});
    const {result: exercises} = await webServiceRPC[webServiceControllers.exercise](channel, 'getByThemeId', {
        themeId,
        difficulty
    });
    if (req.token) {
        const {userId} = await decodeToken(req.token);
        const {result: results} = await progressServiceRPC[progressServiceControllers.exerciseResult](channel, 'get', {
            username: userId,
            themeId,
            difficulty,
        });
        exercises.forEach(ex => {
            const oldResult = ({result, sourceCode}) => {
                const exerciseResult = {sourceCode};
                exerciseResult[result] = true;
                return exerciseResult
            };
            const result = results.find(r => r.exerciseId === ex._id);
            if (result) ex.oldResult = oldResult(result);
        });
    }
    res.render('exercises.hbs', {
        layout: 'themeSelectMain.hbs',
        isJs: true,
        difficulty: req.params.difficulty,
        theme,
        exercises,
        isAuth: !!req.token,
    });
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
            const channel = await getChannel();
            const {result: {number, language}} = await webServiceRPC[webServiceControllers.theme](channel, 'getById', {id: themeId});
            const {result: theme} = await webServiceRPC[webServiceControllers.theme](channel, 'getByNumber', {number: number + 1});
            const path = theme ? `/exercises/${theme._id}/easy` : `/theme/${language}`;
            res.redirect(path);
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
            const channel = await getChannel();
            const {result: {number, language}} = await webServiceRPC[webServiceControllers.theme](channel, 'getById', {id: themeId});
            const theme = await webServiceRPC[webServiceControllers.theme](channel, 'getByNumber', {number: number - 1});
            const path = theme ? `/exercises/${theme._id}/easy` : `/theme/${language}`;
            res.redirect(path);
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
