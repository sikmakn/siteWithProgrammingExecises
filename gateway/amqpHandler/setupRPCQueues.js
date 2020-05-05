const {rpcServices} = require('../options');
const {v4: uuidv4} = require('uuid');
const {getChannel} = require('./amqpReconnect');
const bufferMapper = require('../helpers/objBufferMapper');
//todo try catch all
const sendRPCMessage = function ({rpcQueue, controller, route, message}) {
    return new Promise((resolve) => {
        const correlationId = uuidv4();
        getChannel().then(channel => {
            channel.responseEmitter.once(correlationId, result => {
                const objResult = bufferMapper.bufferToObj(result);
                resolve(objResult);
            });

            const replyTo = rpcQueue + 'Reply';
            channel.sendToQueue(
                rpcQueue,
                bufferMapper.objToBuffer({message, controller, route}),
                {correlationId, replyTo}
            );
        });

    });
};

function addControllersCallers({serviceObjToAdd, controllers, serviceName}) {
    for (let controller in controllers) {
        serviceObjToAdd[controller] = (route, message) => sendRPCMessage({
            rpcQueue: serviceName,
            controller: controllers[controller],
            route,
            message,
        });
    }
}

function createRpcQueues() {
    const rpcQueues = {};
    for (let service in rpcServices) {
        const serviceName = rpcServices[service].serviceName;
        const controllers = rpcServices[service].controllers;

        rpcQueues[serviceName] = {};
        addControllersCallers({
            serviceObjToAdd: rpcQueues[serviceName],
            controllers,
            serviceName,
        });
    }
    return rpcQueues;
}

module.exports = createRpcQueues();