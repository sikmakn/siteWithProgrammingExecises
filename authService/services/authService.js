const authDataRepository = require('../db/repositories/authDataRepository');
const {CONCURRENT_AUTHORIZATION_LIMIT, EXPIRES_HOURS, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {rpcQueues, getChannel} = require('../amqpHandler');
const {rpcServices} = require('../options');
const userServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const userControllers = rpcServices.USER_SERVICE.controllers.user;
const schedule = require('node-schedule');

function startRemoveExpiresSchedule() {
    schedule.scheduleJob({hour: 1}, async function () {
        await authDataRepository.deleteExpired();
    })
}

async function isTooManyAuth(userId) {
    return (await authDataRepository.findCount(userId)) >= CONCURRENT_AUTHORIZATION_LIMIT;
}

async function blockUser(userId) {
    await authDataRepository.deleteByUserId(userId);
    return await userServiceRPC[userControllers](await getChannel(), 'updateBlock', {username: userId});
}

async function createToken({userId, fingerPrint}) {
    const token = sign({userId, fingerPrint});
    await authDataRepository.create({userId, fingerPrint, expiresIn: Date.now() + EXPIRES_HOURS * 60 * 60});
    return token;
}

async function isValidToken({token, fingerPrint}) {
    try {
        const {userId, fingerPrint: oldFingerPrint} = jwt.verify(token, JWT_SECRET);
        return fingerPrint === oldFingerPrint &&
            !!await authDataRepository.findOne({userId, fingerPrint});
    } catch (e) {
        return false;
    }
}

async function updateToken(token) {
    const {userId, fingerPrint} = jwt.decode(token);
    await authDataRepository.updateAuthData({userId, fingerPrint, expiresIn: Date.now() + EXPIRES_HOURS * 60 * 60});
    return sign({userId, fingerPrint})
}

async function deleteOneAuthData({userId, fingerPrint}) {
    return await authDataRepository.deleteOneAuthData({userId, fingerPrint});
}

async function logOutUser(userId) {
    return await authDataRepository.deleteByUserId(userId);
}

async function logOutByToken(token) {
    try {
        const {userId, fingerPrint} = jwt.verify(token, JWT_SECRET);
        const user = await authDataRepository.findOne({userId, fingerPrint});
        if (!user) return false;
        await authDataRepository.deleteOneAuthData({userId, fingerPrint});
        return true;
    } catch (e) {
        return false;
    }
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

function sign({userId, fingerPrint}) {
    return jwt.sign({userId, fingerPrint, id: uuidv4()},
        JWT_SECRET,
        {expiresIn: EXPIRES_HOURS + 'h'});
}