const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const fileDb = {
    bucketName: 'achievements',
    fileColl: 'achievements.files',
};

const pubExchanges = {
    newUserAchievement: 'newUserAchievement',
    error: 'error',
};

module.exports = {
    achievementFields: ["themeId", "result", "difficulty"],
    rpcServiceName: 'userProgressServiceQ',
    serviceName: 'userProgressService',
    mongooseUpdateParams,
    mongoOptions,
    fileDb,
    replyRPCQueueName: 'userProgressService',
    pubExchanges,
};