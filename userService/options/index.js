const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const pubExchanges = {
    blockUser: 'blockUser',
};

module.exports = {
    rpcServiceName: 'userServiceTestQ',
    mongooseUpdateParams,
    mongoOptions,
    pubExchanges,
};