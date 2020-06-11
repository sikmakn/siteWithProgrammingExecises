const subExchanges = {
    email: 'emailNotification',
};
const emailTemplates = {
    blockUserObj: {subject: 'Блокировка аккаунта'},
    unblockUserObj: {subject: 'Разблокировка аккаунта'},
    verifyUserObj: {subject: 'Подтверждение аккаунта'}
};

const pubExchanges = {error: 'error'};

module.exports = {
    rpcServiceName: 'emailNotificationServiceQ',
    serviceName: 'emailNotification',
    pubExchanges,
    subExchanges,
    emailTemplates,
    replyRPCQueueName: 'emailNotificationServiceReply',
};