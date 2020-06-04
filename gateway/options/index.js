const rpcServices = {
    WEB_SERVICE: {
        serviceName: 'webServiceQ',
        controllers: {
            theme: 'theme',
            exercise: 'exercise',
        },
    },
    PROGRESS_SERVICE: {
        serviceName: 'userProgressServiceQ',
        controllers: {
            achievement: 'achievement',
            exerciseResult: 'exerciseResult',
            userAchievement: 'userAchievement',
        },
    },
    USER_SERVICE: {
        serviceName: 'userServiceQ',
        controllers: {
            user: 'user',
        }
    },
    AUTH_SERVICE: {
        serviceName: 'authServiceQ',
        controllers: {
            auth: 'auth',
        }
    },
    LOG_SERVICE: {
        serviceName: 'loggingServiceQ',
        controllers: {
            log: 'log',
        }
    },
};

const pubExchanges = {
    exerciseTests: 'exerciseTests',
};

module.exports = {
    rpcServices,
    pubExchanges,
    replyRPCQueueName: 'gatewayReply',
};