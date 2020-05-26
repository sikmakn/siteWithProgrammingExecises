const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const authServiceRPC = rpcQueues[rpcServices.AUTH_SERVICE.serviceName];
const authControllers = rpcServices.AUTH_SERVICE.controllers;
const setTokenToCookie = require('../helpers/setTokenToCookie');


async function isAuthMiddleware(req, res, next) {
    const token = getTokenFromCookie(req);
    if (!token) {
        res.status(403).send();//todo redirect to login page
        return;
    }
    const {result: newToken} = await authServiceRPC[authControllers.user]('isAuthenticated', {
        token,
        fingerPrint: req.headers.fingerprint,
    });
    if (!newToken) {
        res.status(403).send();//todo redirect to login page
        return;
    }
    setTokenToCookie(res, token);
    next();
}

async function authValidate(req, res) {
    const token = getTokenFromCookie(req);
    if (!token) return;

    const {result: newToken} = await authServiceRPC[authControllers.user]('isAuthenticated', {
        token,
        fingerPrint: req.headers.fingerprint,
    });
    if (!newToken) return;

    setTokenToCookie(res, token);
    return token;
}

module.exports = {
    isAuthMiddleware,
    authValidate
};

function getTokenFromCookie(req) {
    if (req.cookies.authorization && req.cookies.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
}
