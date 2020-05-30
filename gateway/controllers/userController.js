const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authController = rpcServices.AUTH_SERVICE.controllers.auth;
const progressServiceRPC = rpcQueues[rpcServices.PROGRESS_SERVICE.serviceName];
const progressControllers = rpcServices.PROGRESS_SERVICE.controllers;
const {setFingerprint, setToken} = require('../helpers/setToCookie');
const {decodeToken} = require('../helpers/auth');

const router = express.Router();

router.get('/achievements', asyncHandler(async (req, res) => {
    if (!req.token) {
        res.redirect('/user/login');
        return;
    }
    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const {result: achievements} = await progressServiceRPC[progressControllers.userAchievement](channel,
        'getByUsername', {username});

    let choosenAchievement = !req.query.achievementId ?
        achievements[0] :
        await progressServiceRPC[progressControllers.achievement](channel,
            'getAchievement', {id: req.query.achievementId});

    res.render('achievements.hbs', {
        layout: 'empty.hbs',
        isAuth: true,
        achievements,
        choosenAchievement,
    });
}));

router.get('/register', (req, res) =>
    res.render('register.hbs', {layout: 'empty.hbs'}));

router.post('/register', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const createRes = await userServiceRPC[userControllers.user](channel, 'create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (!createRes.result) {
        res.render('register.hbs', {layout: 'empty.hbs', isUsernameExist: true});
        return;
    }
    res.redirect('/user/login');
}));

router.get('/login', (req, res) =>
    res.render('login.hbs', {layout: 'empty.hbs'}));

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
    const {result: token} = await authServiceRPC[authController](channel, 'login', {
        userId: req.body.username,
        fingerPrint: req.body.fingerprint,
    });
    if (!token) {
        res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});
        return;
    }
    setToken(res, token);
    setFingerprint(res, req.body.fingerprint);

    res.redirect('/user/achievements');
}));

router.get('/logout', asyncHandler(async (req, res) => {
    await authServiceRPC[authController](
        await getChannel(),
        'logoutByToken',
        {token: req.token});
    res.clearCookie('Authorization');
    res.clearCookie('fingerprint');
    res.redirect('/user/login');
}));

router.get('/profile', asyncHandler(async (req, res) => {
    if (!req.token) {
        res.redirect('/user/login');
        return;
    }
    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const {email} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {layout: 'empty.hbs', email, username, isAuth: true});
}));

router.post('/profile', asyncHandler(async (req, res) => {
    if (!req.token) {
        res.redirect('/user/login');
        return;
    }
    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const answer = await userServiceRPC[userControllers.user](channel, 'updatePersonalInfo', {
        username,
        oldPassword: req.body.oldPassword,
        email: req.body.email,
        password: req.body.password,
    });
    const {email} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {
        layout: 'empty.hbs',
        isAuth: true,
        isUpdated: !!answer.result,
        isNotUpdated: !!answer.error,
        username,
        email
    });
}));

module.exports = router;