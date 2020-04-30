const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const webServiceControllers = rpcServices.WEB_SERVICE.controllers;

module.exports = function themeController() {
    const router = express.Router();

    router.get('/:lang', asyncHandler(async (req, res) => {
        const {lang} = req.params;
        const themesList = await webServiceRPC[webServiceControllers.theme]('getByLang', {lang});
        const resObj = {
            layout: 'themeSelectMain.hbs',
            themesList,
            lang,
        };
        const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
        resObj[flagName] = true;

        res.render('themesList.hbs', resObj);
    }));

    router.post('/', asyncHandler(async (req, res, next) => {
        // res.json(createdTheme);
        next();
    }));

    return router;
};
