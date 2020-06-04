const {logMessage} = require('../models/logMessage');

async function create({message, timeStamp, serviceName}) {
    const newMessage = new logMessage({message, timeStamp, serviceName});
    return await newMessage.save();
}

async function get({serviceName, from, to}) {
    const queryObj = {};
    if (serviceName) queryObj.serviceName = serviceName;
    if (from || to) {
        queryObj.timeStamp = {};
        if (from) queryObj.timeStamp.$gte = from;
        if (to) queryObj.timeStamp.$lte = to;
    }
    return await logMessage.find(queryObj);
}

module.exports = {
    create,
    get,
};