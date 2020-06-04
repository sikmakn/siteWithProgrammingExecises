const logMessageRepository = require('./db/repositories/logMessageRepository');

async function create({message, serviceName, timeStamp}) {
    return await logMessageRepository.create({message, serviceName, timeStamp});
}

async function get({serviceName, from, to}) {
    return await logMessageRepository.get({serviceName, from, to});
}

module.exports = {
    create,
    get,
};