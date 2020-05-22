const {user} = require('../models/user');
const {mongooseUpdateParams} = require('../../options');

async function create({username, password, email, status, isBlocked, salt}) {
    const newUser = new user({username, password, salt, email, status, isBlocked});
    return await newUser.save();
}

async function findById(id) {
    return await user.findById(id);
}

async function findByUsername(username) {
    return await user.findOne({username});
}

async function updateUser({ username, password, email, status, isBlocked, salt}) {
    return await user.findOneAndUpdate({username},
        {
            username,
            password,
            email,
            status,
            isBlocked,
            salt,
        },
        mongooseUpdateParams);
}

module.exports = {
    create,
    findById,
    findByUsername,
    updateUser,
};