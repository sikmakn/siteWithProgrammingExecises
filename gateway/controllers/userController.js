const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const setTokenToCookie = require('../helpers/setTokenToCookie');

const router = express.Router();

router.get('/auth',  (req, res) => {
    res.render('auth.hbs', {layout: 'empty.hbs'});
});

router.post('/auth', asyncHandler(async (req, res) => {
    console.log('bbb');
    const createRes = await userServiceRPC[userControllers.user]('create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (!createRes.result) {
        res.status(401).send();
        return;
    }
    res.status(200).send();//todo redirect to login
}));

router.post('/login', asyncHandler(async (req, res) => {
    const {result: isValid} = await userServiceRPC[userControllers.user]('isValidNonBlocked', {
        username: req.body.username,
        password: req.body.password,
    });
    if (!isValid) {
        res.status(401).send();
        return;
    }
    const {result: token} = await authServiceRPC[authControllers.auth]('login', {
        userId: req.body.username,
        fingerPrint: req.body.fingerprint,
    });
    if (!token) {
        res.status(401).send();
        return;
    }
    setTokenToCookie(res, token);
    res.status(200).send();//todo redirect to userPage
}));

module.exports = router;