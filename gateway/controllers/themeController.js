const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const themeController = rpcServices.WEB_SERVICE.controllers.theme;

const router = express.Router();

router.get('/:lang', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {lang} = req.params;
    const {result: themesList} = await webServiceRPC[themeController](channel, 'getAllByLang', {lang});
    const resObj = {
        layout: 'themeSelectMain.hbs',
        themesList,
        lang,
        isAuth: !!req.token,
    };
    const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
    resObj[flagName] = true;
    res.render('themesList.hbs', resObj);
}));

router.post('/', asyncHandler(async (req, res) => {//todo auth isAdmin
    const channel = await getChannel();
    const {result:createdTheme} = await webServiceRPC[themeController](channel, 'create', req.body);
    res.json(createdTheme);
}));

router.patch('/:id', asyncHandler(async (req, res) => {//todo auth isAdmin
    const channel = await getChannel();
    const {result:updatedTheme} = await webServiceRPC[themeController](channel, 'updateById', {
        id: req.params.id,
        theme: req.body,
    });
    res.json(updatedTheme);
}));

module.exports = router;
