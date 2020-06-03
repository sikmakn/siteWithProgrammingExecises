const {logMessage} = require('../models/logMessage');

async function create({message, timeStamp, serviceName}) {
    const newMessage = new logMessage({message, timeStamp, serviceName});
    return await newMessage.save();
}

module.exports = {
    create,
};