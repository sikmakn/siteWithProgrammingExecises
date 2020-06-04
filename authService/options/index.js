const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const rpcServices = {
    USER_SERVICE: {
        serviceName: 'userServiceQ',
        controllers: {
            user: 'user',
        }
    }
};

const pubExchanges = {error: 'error'};

module.exports = {
    mongoOptions,
    mongooseUpdateParams,
    rpcServiceName: 'authServiceQ',
    serviceName: 'authService',
    pubExchanges,
    rpcServices,
    replyRPCQueueName: 'authServiceReply',
};