const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const rpcServices = {
    USER_SERVICE: {
        serviceName: 'userServiceTestQ',
        controllers: {
            user: 'user',
        }
    }
};
module.exports = {
    mongoOptions,
    mongooseUpdateParams,
    rpcServiceName: 'authServiceTestQ',
    rpcServices,
    serviceName: 'authService',
};