const express = require('express');
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers;
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authController = rpcServices.AUTH_SERVICE.controllers.auth;
const emailServiceRPC = rpcQueues[rpcServices.EMAIL_SERVICE.serviceName];
const emailController = rpcServices.EMAIL_SERVICE.controllers.email;
const {setFingerprint, setToken} = require('../helpers/setToCookie');
const {adminValidate} = require('../helpers/auth');
const {decodeToken} = require('../helpers/auth');

const router = express.Router();

router.get('/register', (req, res) =>
    res.render('register.hbs', {layout: 'empty.hbs'}));

router.post('/register', asyncHandler(async (req, res) => {
    const {username, password, email} = req.body;
    const channel = await getChannel();
    const createRes = await userServiceRPC[userControllers.user](channel, 'create', {username, password, email});
    if (!createRes.result)
        return res.render('register.hbs', {layout: 'empty.hbs', isUsernameExist: true});
    await emailServiceRPC[emailController](channel, 'sendVerify', {
        email,
        username,
        verifyLink: `/user/verify/${createRes.result}`,
        deleteLink: `/user/delete/verify/${createRes.result}`,
    });
    res.render('registredInfo.hbs', {layout: 'themeSelectMain.hbs'});
}));

router.get('/verify/:id', asyncHandler(async (req, res, next) => {
    const {error} = await userServiceRPC[userControllers.usersForVerify](await getChannel(), 'verify',
        {id: req.params.id});
    if (error) return next();
    res.render('verifiedAccountInfo.hbs', {layout: 'themeSelectMain.hbs'});
}));

router.get('/delete/verify/:id', asyncHandler(async (req, res, next) => {
    const {error} = await userServiceRPC[userControllers.usersForVerify](await getChannel(), 'delete',
        {id: req.params.id});
    if (error) return next();
    res.render('deletedAccountInfo.hbs', {layout: 'themeSelectMain.hbs'});
}));

router.get('/login', (req, res) =>
    res.render('login.hbs', {layout: 'empty.hbs'}));

router.post('/login', asyncHandler(async (req, res) => {
    const {username, password, fingerprint} = req.body;
    const channel = await getChannel();
    const {result: isValid} = await userServiceRPC[userControllers.user](channel, 'isValidNonBlocked',
        {username, password});

    if (!isValid) return res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});

    const {result: role} = await userServiceRPC[userControllers.user](channel, 'getRole', {username});

    const {result: token} = await authServiceRPC[authController](channel, 'login',
        {fingerPrint: fingerprint, userId: username, role});

    if (!token) return res.render('login.hbs', {layout: 'empty.hbs', isNonValid: true});

    setToken(res, token);
    setFingerprint(res, req.body.fingerprint);

    res.redirect('/achievement');
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
    if (!result)
        return res.status(500).render('404.hbs', {layout: 'themeSelectMain.hbs', isAuth: !!req.token});
    res.render('profile.hbs', {layout: 'empty.hbs', email: result.email, username, isAuth: true});
}));

router.post('/profile', asyncHandler(async (req, res) => {
    if (!req.token) return res.redirect('/user/login');

    const {oldPassword, password, email} = req.body;
    const channel = await getChannel();
    const {userId: username} = await decodeToken(req.token);
    const answer = await userServiceRPC[userControllers.user](channel, 'updatePersonalInfo',
        {username, oldPassword, password, email});

    const {email: newEmail} = await userServiceRPC[userControllers.user](channel, 'getPersonalInfo', {username});
    res.render('profile.hbs', {
        layout: 'empty.hbs',
        isNotUpdated: !!answer.error,
        isUpdated: !!answer.result,
        isAuth: true,
        username,
        email: newEmail,
    });
}));

router.put('/', adminValidate, asyncHandler(async (req, res) => {
    const {username, isBlocked, role, email} = req.body;
    const answer = await userServiceRPC[userControllers.user](await getChannel(), 'update',
        {username, isBlocked, role, email});
    if (answer.error) res.status(500);
    res.json(answer);
}));

router.delete('/:username', adminValidate, asyncHandler(async (req, res) => {
    const answer = await userServiceRPC[userControllers.user](await getChannel(), 'delete',
        {username: req.params.username});
    if (answer.error) res.status(500);
    res.json(answer);
}));

module.exports = router;