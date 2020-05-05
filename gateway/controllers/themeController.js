const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const webServiceControllers = rpcServices.WEB_SERVICE.controllers;

const router = express.Router();

router.get('/:lang', asyncHandler(async (req, res) => {
    const {lang} = req.params;
    const themesList = await webServiceRPC[webServiceControllers.theme]('getAllByLang', {lang});
    const resObj = {
        layout: 'themeSelectMain.hbs',
        themesList,
        lang,
    };
    const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
    resObj[flagName] = true;

    res.render('themesList.hbs', resObj);
}));

router.post('/', asyncHandler(async (req, res) => {//todo auth isAdmin
    const createdTheme = await webServiceRPC[webServiceControllers.theme]('create', req.body);
    res.json(createdTheme);
}));

router.patch('/:id', asyncHandler(async (req, res) => {//todo auth isAdmin
    const updatedTheme = await webServiceRPC[webServiceControllers.theme]('updateById', {
        id: req.params.id,
        theme: req.body,
    });
    res.json(updatedTheme);
}));

module.exports = router;
