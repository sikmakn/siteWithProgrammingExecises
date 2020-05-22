const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

module.exports = {
    rpcServiceName: 'userServiceTestQ',
    mongooseUpdateParams,
    mongoOptions,
};