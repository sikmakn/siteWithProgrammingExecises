const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true, upsert: true};

const pubExchanges = {error: 'error'};

module.exports = {
    mongooseUpdateParams,
    mongoOptions,
    rpcServiceName: 'websocketNotificationServiceQ',
    serviceName: 'websocketNotificationService',
    replyRPCQueueName: 'webSocketReply',
    pubExchanges,
};