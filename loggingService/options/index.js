const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

module.exports = {
    replyRPCQueueName: 'loggingServiceReply',
    serviceName: 'loggingService',
    mongoOptions,
    rpcServiceName: 'loggingServiceQ'
};