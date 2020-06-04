const {user} = require('../models/user');
const {mongooseUpdateParams} = require('../../options');

async function create({username, password, email, role, isBlocked, salt}) {
    const newUser = new user({username, password, salt, email, role, isBlocked});
    return await newUser.save();
}

async function findById(id) {
    return await user.findById(id);
}

async function findByUsername(username) {
    return await user.findOne({username});
}

async function findByIdentityData({username, email}) {
    return await user.findOne({$or: [{username}, {email}]});
}

async function updateUser({username, password, email, role, isBlocked, salt}) {
    return await user.findOneAndUpdate({username},
        {
            username,
            password,
            email,
            role,
            isBlocked,
            salt,
        },
        mongooseUpdateParams);
}

module.exports = {
    create,
    findById,
    findByUsername,
    findByIdentityData,
    updateUser,
};