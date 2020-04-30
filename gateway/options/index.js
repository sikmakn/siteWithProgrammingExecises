const loggerOptions = {
    filename: './log/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
};


const rpcServices = {
    WEB_SERVICE: {
        serviceName: 'webServiceTestQ',
        controllers: {
            theme: 'theme',
            exercise: 'exercise',
        },
    }
};

module.exports = {
    rpcServices
};