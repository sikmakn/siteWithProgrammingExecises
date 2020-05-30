const loggerOptions = {//todo
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
    },
    PROGRESS_SERVICE: {
        serviceName: 'userProgressServiceTestQ',
        controllers: {
            achievement: 'achievement',
            exerciseResult: 'exerciseResult',
        },
    },
    USER_SERVICE: {
        serviceName: 'userServiceTestQ',
        controllers: {
            user: 'user',
        }
    },
    AUTH_SERVICE: {
        serviceName: 'authServiceTestQ',
        controllers: {
            auth: 'auth',
        }
    }
};

const pubExchanges = {
    exerciseTests: 'exerciseTests',
};

module.exports = {
    rpcServices,
    pubExchanges,
    replyRPCQueueName:'gatewayReply',
};