const usersForVerifyRepository = require('../db/repositories/usersForVerifyRepository');

async function create({username}) {
    return await usersForVerifyRepository.create({username});
}

async function remove({id}) {
    return await usersForVerifyRepository.remove({id});
}

module.exports = {
    create,
    remove,
};