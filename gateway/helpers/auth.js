const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const {setToken} = require('./setToCookie');
const jwt = require('jsonwebtoken');

async function isAuth(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) {
        res.redirect('/user/login');
        return;
    }
    const channel = await getChannel();
    const {result: newToken} = await authServiceRPC[authControllers.user](channel, 'updateToken', {
        token,
        fingerPrint: req.headers.fingerprint,
    });
    if (!newToken) {
        res.redirect('/user/login');
        return;
    }
    setToken(res, token);
    next();
}

async function authValidate(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) {
        next();
        return;
    }
    const channel = await getChannel();
    const {result: newToken} = await authServiceRPC[authControllers.auth](channel, 'updateToken', {
        token,
        fingerPrint: req.cookies.fingerprint,
    });
    if (!newToken) {
        delete req.cookies.Authorization;
        res.clearCookie('Authorization');
        res.clearCookie('fingerprint');
        next();
        return;
    }

    setToken(res, newToken);
    req.token = newToken;
    next();
}

async function adminValidate(req, res, next) {
    if (!req.token) return res.status(403).render('403.hbs', {
        layout: 'themeSelectMain.hbs',
        isAuth: !!req.token,
    });
    const {role} = jwt.decode(req.token);
    if (role !== 'admin') return res.status(403).render('403.hbs', {
        layout: 'themeSelectMain.hbs',
        isAuth: !!req.token,
    });
    next();
}

async function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    isAuth,
    authValidate,
    decodeToken,
    adminValidate,
};

function getTokenFromCookie(req) {
    if (req.cookies.Authorization && req.cookies.Authorization.split(' ')[0] === 'Bearer')
        return req.cookies.Authorization.split(' ')[1];
}