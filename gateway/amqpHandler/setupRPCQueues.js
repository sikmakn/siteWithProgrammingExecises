const {rpcServices, replyRPCQueueName} = require('../options');
const {v4: uuidv4} = require('uuid');
const bufferMapper = require('../helpers/objBufferMapper');
//todo try catch all
const sendRPCMessage = function ({queueName, controller, route, message, channel}) {
    return new Promise((resolve) => {
        const correlationId = uuidv4();
        channel.responseEmitter.once(correlationId, (result) => resolve(bufferMapper.bufferToObj(result)));

        const replyTo = queueName + replyRPCQueueName;
        const bufferReplyMessage = bufferMapper.objToBuffer({message, controller, route});
        channel.sendToQueue(queueName, bufferReplyMessage, {correlationId, replyTo});
    });
};

function addControllersCallers({controllers, serviceName}) {
    const serviceObj = {};
    for (const [controllerName, controller] of Object.entries(controllers))
        serviceObj[controllerName] = (channel, route, message) =>
            sendRPCMessage({queueName: serviceName, controller, route, message, channel});
    return serviceObj;
}

function createRpcQueues() {
    const rpcQueues = {};
    if (rpcServices)
        for (let service of Object.values(rpcServices))
            rpcQueues[service.serviceName] = addControllersCallers(service);
    return rpcQueues;
}

module.exports = createRpcQueues();