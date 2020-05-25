const {authData} = require('../models/authData');
const {mongooseUpdateParams} = require('../../options');

async function create({userId, fingerPrint, expiresIn}) {
    const newAuthData = new authData({userId, fingerPrint, expiresIn});
    return await newAuthData.save();
}

async function findCount(userId) {
    return await authData.count({userId});
}

async function findOne({userId, fingerPrint, expiresIn}) {
    return await authData.findOne({userId, fingerPrint, expiresIn});
}

async function findByUserId(userId) {
    return await authData.find({userId});
}

async function updateAuthData({userId, fingerPrint, expiresIn}) {
    return await user.findOneAndUpdate({userId, fingerPrint},
        {userId, fingerPrint, expiresIn},
        mongooseUpdateParams);
}

async function deleteOneAuthData({userId, fingerPrint}) {
    return await authData.findByIdAndDelete({userId, fingerPrint});
}

async function deleteExpired() {
    return await authData.deleteMany({expiresIn: {$gte: Date.now()}})
}

async function deleteByUserId(userId) {
    return await authData.deleteMany({userId})
}

module.exports = {
    create,
    findOne,
    findCount,
    findByUserId,
    updateAuthData,
    deleteExpired,
    deleteByUserId,
    deleteOneAuthData,
};