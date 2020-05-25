const authDataRepository = require('../db/repositories/authDataRepository');
const {CONCURRENT_AUTHORIZATION_LIMIT, EXPIRES_HOURS, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const {getRandomString} = require('../helpers/randomString');

async function isTooManyAuth(userId) {
    return (await authDataRepository.findCount(userId)) >= CONCURRENT_AUTHORIZATION_LIMIT;
}

async function blockUser(userId) {
    await authDataRepository.deleteByUserId(userId);
    //todo push block User
}

async function createToken({userId, fingerPrint}) {
    const token = sign({userId, fingerPrint});
    await authDataRepository.create({userId, fingerPrint, expiresIn: Date.now() + EXPIRES_HOURS * 60 * 60});
    return token;
}

async function isValidToken({token, fingerPrint}) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return fingerPrint !== decoded &&
            !!await authDataRepository.findOne({userId: decoded.userId, fingerPrint});
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

module.exports = {
    isTooManyAuth,
    blockUser,
    createToken,
    isValidToken,
    updateToken,
    logOutUser,
    deleteOneAuthData,
};

function sign({userId, fingerPrint}) {
    return jwt.sign({userId, fingerPrint, id: getRandomString()},
        JWT_SECRET,
        {expiresIn: EXPIRES_HOURS + 'h'});
}