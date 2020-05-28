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

module.exports = {
    achievementFields: ["themeId", "result", "difficulty"],
    rpcServiceName: 'userProgressServiceTestQ',
    mongooseUpdateParams,
    mongoOptions,
    fileDb,
    serviceName: 'userProgressService',
};