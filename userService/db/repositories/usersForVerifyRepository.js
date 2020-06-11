const {usersForVerify} = require('../models/usersForVerify');

async function create({username}) {
    const newUser = new usersForVerify({username});
    return await newUser.save();
}

async function remove({id}) {
    return await usersForVerify.findByIdAndDelete(id);
}

module.exports = {
    create,
    remove,
};