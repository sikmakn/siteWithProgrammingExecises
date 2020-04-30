const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const webServiceControllers = rpcServices.WEB_SERVICE.controllers;

module.exports = function exerciseController() {
    const router = express.Router();

    router.post('/:themeId/:exerciseId/test', asyncHandler(async (req, res, next) => {

        //webServiceRPC[webServiceControllers.theme]()
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
