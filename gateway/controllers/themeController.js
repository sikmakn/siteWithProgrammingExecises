const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const webServiceRPC = rpcQueues[rpcServices.WEB_SERVICE.serviceName];
const themeController = rpcServices.WEB_SERVICE.controllers.theme;
const {adminValidate} = require('../helpers/auth');

const router = express.Router();

router.get('/:lang', asyncHandler(async (req, res, next) => {
    const channel = await getChannel();
    const {lang} = req.params;
    const {result: themesList} = await webServiceRPC[themeController](channel, 'getAllByLang', {lang});
    if (!themesList || !themesList.length) return next();
    res.render('themesList.hbs', {
        layout: 'themeSelectMain.hbs',
        [`is${lang[0].toUpperCase() + lang.slice(1)}`]: true,
        isAuth: !!req.token,
        themesList,
        lang,
    });
}));

router.post('/', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await webServiceRPC[themeController](channel, 'create', req.body);
    if (answer.error) res.status(500);
    res.json(answer);
}));

router.patch('/:id', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await webServiceRPC[themeController](channel, 'updateById', {
        id: req.params.id,
        theme: req.body,
    });
    if (answer.error || !answer.result) res.status(500);
    res.json(answer);
}));

router.delete('/:id', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await webServiceRPC[themeController](channel, 'deleteById', {id: req.params.id});
    if (answer.error) req.status(500);
    res.json(answer);
}));

module.exports = router;