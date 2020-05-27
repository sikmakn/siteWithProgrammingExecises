const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const {setToken} = require('./setToCookie');
const jwt = require('jsonwebtoken');


async function isAuth(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) {
        res.status(403).send();//todo redirect to login page
        return;
    }
    const {result: newToken} = await authServiceRPC[authControllers.user]('updateToken', {
        token,
        fingerPrint: req.headers.fingerprint,
    });
    if (!newToken) {
        res.status(403).send();//todo redirect to login page
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

    const {result: newToken} = await authServiceRPC[authControllers.auth]('updateToken', {
        token,
        fingerPrint: req.cookies.fingerprint,
    });
    if (!newToken) {
        next();
        return;
    }

    setToken(res, newToken);
    req.token = newToken;
    next();
}

async function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    isAuth,
    authValidate,
    decodeToken,
};

function getTokenFromCookie(req) {
    if (req.cookies.Authorization && req.cookies.Authorization.split(' ')[0] === 'Bearer')
        return req.cookies.Authorization.split(' ')[1];
}