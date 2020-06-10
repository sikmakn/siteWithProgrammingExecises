const rpcServices = {
    WEB_SERVICE: {
        serviceName: 'webServiceQ',
        controllers: {
            theme: 'theme',
            exercise: 'exercise',
        },
    },
    WEBSOCKET_NOTIFICATION_SERVICE:{
        serviceName: 'websocketNotificationServiceQ',
        controllers:{
            achievement:'achievement',
        }
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
    error: 'error',
};

module.exports = {
    serviceName: 'gateway',
    rpcServices,
    pubExchanges,
    replyRPCQueueName: 'gatewayReply',
};