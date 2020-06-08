const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authController = rpcServices.AUTH_SERVICE.controllers.auth;
const {setFingerprint, setToken} = require('../helpers/setToCookie');
const {decodeToken} = require('../helpers/auth');

const router = express.Router();

router.get('/register', (req, res) =>
    res.render('register.hbs', {layout: 'empty.hbs'}));

router.post('/register', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const createRes = await userServiceRPC[userControllers.user](channel, 'create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (!createRes.result) return res.render('register.hbs', {layout: 'empty.hbs', isUsernameExist: true});

    res.redirect('/user/login');
}));

router.get('/login', (req, res) =>
    res.render('login.hbs', {layout: 'empty.hbs'}));

router.post('/login', asyncHandler(async (req, res) => {
    const {username, password, fingerprint} = req.body;
    const channel = await getChannel();
    const {result: isValid} = await userServiceRPC[userControllers.user](channel, 'isValidNonBlocked',
        {username, password});

    if (!isValid) return res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});

    const {result: role} = await userServiceRPC[userControllers.user](channel, 'getRole',
        {username: req.body.username});

    const {result: token} = await authServiceRPC[authController](channel, 'login',
        {fingerPrint: fingerprint, userId: username, role});

    if (!token) return res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});

    setToken(res, token);
    setFingerprint(res, req.body.fingerprint);

    res.redirect('/user/achievements');
}));

router.get('/logout', asyncHandler(async (req, res) => {
    await authServiceRPC[authController](await getChannel(), 'logoutByToken', {token: req.token});
    res.clearCookie('Authorization');
    res.clearCookie('fingerprint');
    res.redirect('/user/login');
}));

router.get('/profile', asyncHandler(async (req, res) => {
    if (!req.token) return res.redirect('/user/login');

    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const {result} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {layout: 'empty.hbs', email: result.email, username, isAuth: true});
}));

router.post('/profile', asyncHandler(async (req, res) => {
    if (!req.token) return res.redirect('/user/login');

    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const answer = await userServiceRPC[userControllers.user](channel, 'updatePersonalInfo', {
        username,
        oldPassword: req.body.oldPassword,
        password: req.body.password,
        email: req.body.email,
    });
    const {email} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {
        layout: 'empty.hbs',
        isNotUpdated: !!answer.error,
        isUpdated: !!answer.result,
        isAuth: true,
        username,
        email,
    });
}));

module.exports = router;