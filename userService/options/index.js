const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const pubExchanges = {
    blockUser: 'blockUser',
    error: 'error',
};

module.exports = {
    rpcServiceName: 'userServiceQ',
    serviceName: 'userService',
    mongooseUpdateParams,
    mongoOptions,
    pubExchanges,
    replyRPCQueueName: 'userService',
};