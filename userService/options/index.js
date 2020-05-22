const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const subExchanges = {
    exerciseTests: 'exerciseTests',
};

module.exports = {
    rpcServiceName: 'userServiceTestQ',
    mongooseUpdateParams,
    subExchanges,
    mongoOptions,
};