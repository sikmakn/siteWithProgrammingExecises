const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const {setFingerprint, setToken} = require('../helpers/setToCookie');
const {decodeToken} = require('../helpers/auth');

const router = express.Router();

router.get('/register', (req, res) =>
    res.render('register.hbs', {layout: 'empty.hbs', isAuth: !!req.token}));

router.post('/register', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const createRes = await userServiceRPC[userControllers.user](channel, 'create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (!createRes.result) {
        res.render('register.hbs', {layout: 'empty.hbs', isUsernameExist: true, isAuth: !!req.token});
        return;
    }
    res.redirect('/user/login');
}));

router.get('/login', (req, res) =>
    res.render('login.hbs', {layout: 'empty.hbs', isAuth: !!req.token}));

router.get('/profile', asyncHandler(async (req, res) => {
    if (!req.token) {
        res.redirect('/user/login');
        return;
    }
    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const {email} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {layout: 'empty.hbs', email, username, isAuth: !!req.token});
}));

router.post('/profile', asyncHandler(async (req, res) => {
    if (!req.token) {
        res.redirect('/user/login');
        return;
    }

    const {userId: username} = await decodeToken(req.token);
    const answer = await userServiceRPC[userControllers.user](await getChannel(), 'updatePersonalInfo', {
        username,
        oldPassword: req.body.oldPassword,
        email: req.body.email,
        password: req.body.password,
    });
    res.render('profile.hbs', {isAuth: !!req.token, isUpdated: !!answer.result, isNotUpdate: !answer.result});
}));

router.post('/login', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {result: isValid} = await userServiceRPC[userControllers.user](channel, 'isValidNonBlocked', {
        username: req.body.username,
        password: req.body.password,
    });

    if (!isValid) {
        res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true, isAuth: !!req.token});
        return;
    }
    const {result: token} = await authServiceRPC[authControllers.auth](channel, 'login', {
        userId: req.body.username,
        fingerPrint: req.body.fingerprint,
    });
    if (!token) {
        res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true, isAuth: !!req.token});
        return;
    }
    setToken(res, token);
    setFingerprint(res, req.body.fingerprint);

    res.redirect('/user/achievements');
}));

module.exports = router;