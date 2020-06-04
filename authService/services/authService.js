const authDataRepository = require('../db/repositories/authDataRepository');
const {CONCURRENT_AUTHORIZATION_LIMIT, EXPIRES_HOURS, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {rpcQueues, getChannel, publish} = require('../amqpHandler');
const {rpcServices, pubExchanges, serviceName} = require('../options');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers.user;
const schedule = require('node-schedule');
const {serializeError} = require('serialize-error');

function startRemoveExpiresSchedule() {
    schedule.scheduleJob({hour: 1}, async function () {
        try {
            await authDataRepository.deleteExpired();
        } catch (error) {
            await publish(await getChannel(), pubExchanges.error, {
                error: serializeError(error),
                date: Date.now(),
                serviceName,
            });
        }
    })
}

async function isTooManyAuth(userId) {
    return (await authDataRepository.findCount(userId)) >= CONCURRENT_AUTHORIZATION_LIMIT;
}

async function blockUser(userId) {
    await authDataRepository.deleteByUserId(userId);
    return await userServiceRPC[userControllers](await getChannel(), 'updateBlock', {username: userId});
}

async function createToken({userId, fingerPrint, role}) {
    const token = sign({userId, fingerPrint, role});
    await authDataRepository.create({userId, fingerPrint, expiresIn: Date.now() + EXPIRES_HOURS * 60 * 60});
    return token;
}

async function isValidToken({token, fingerPrint}) {
    try {
        const {fingerPrint: oldFingerPrint} = jwt.verify(token, JWT_SECRET);
        return fingerPrint === oldFingerPrint;
    } catch (e) {
        return false;
    }
}

async function updateToken(token) {
    const {userId, fingerPrint, role} = jwt.decode(token);

    await authDataRepository.updateAuthData({userId, fingerPrint, expiresIn: Date.now() + EXPIRES_HOURS * 60 * 60});
    return sign({userId, fingerPrint, role})
}

async function deleteOneAuthData({userId, fingerPrint}) {
    return await authDataRepository.deleteOneAuthData({userId, fingerPrint});
}

async function logOutUser(userId) {
    return await authDataRepository.deleteByUserId(userId);
}

async function logOutByToken(token) {
    let userId, fingerPrint;
    try {
        ({userId, fingerPrint} = jwt.verify(token, JWT_SECRET));
    } catch (e) {
        if (e.name !== 'TokenExpiredError') return false;
        ({userId, fingerPrint} = jwt.decode(token));
    }
    const user = await authDataRepository.findOne({userId, fingerPrint});
    if (!user) return false;
    await authDataRepository.deleteOneAuthData({userId, fingerPrint});
    return true;
}

module.exports = {
    logOutByToken,
    isTooManyAuth,
    blockUser,
    createToken,
    isValidToken,
    updateToken,
    logOutUser,
    deleteOneAuthData,
    startRemoveExpiresSchedule,
};

function sign({userId, fingerPrint, role}) {
    return jwt.sign({userId, fingerPrint, role, id: uuidv4()},
        JWT_SECRET,
        {expiresIn: EXPIRES_HOURS + 'h'});
}