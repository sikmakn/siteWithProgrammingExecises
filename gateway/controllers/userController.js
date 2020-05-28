const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const {setFingerprint, setToken} = require('../helpers/setToCookie');

const router = express.Router();

router.get('/registration', (req, res) => {
    res.render('registration.hbs', {layout: 'empty.hbs'});
});

router.post('/registration', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const createRes = await userServiceRPC[userControllers.user](channel, 'create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (!createRes.result) {
        res.render('registration.hbs', {layout: 'empty.hbs', isUsernameExist: true});
        return;
    }
    res.redirect('/user/login');
}));

router.get('/login', (req, res) => {
    res.render('login.hbs', {layout: 'empty.hbs'});
});

router.post('/login', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {result: isValid} = await userServiceRPC[userControllers.user](channel, 'isValidNonBlocked', {
        username: req.body.username,
        password: req.body.password,
    });
    if (!isValid) {
        res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});
        return;
    }
    const {result: token} = await authServiceRPC[authControllers.auth](channel, 'login', {
        userId: req.body.username,
        fingerPrint: req.body.fingerprint,
    });
    if (!token) {
        res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});
        return;
    }
    setToken(res, token);
    setFingerprint(res, req.body.fingerprint);

    res.redirect('/');//todo redirect to userPage
}));

module.exports = router;