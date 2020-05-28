const subExchanges = {
    email: 'emailNotification',
};
const emailTemplates = {
    blockUserObj: {subject: 'Блокировка аккаунта'},
    unblockUserObj: {subject: 'Разблокировка аккаунта'},
    verifyUserObj: {subject: 'Подтверждение аккаунта'}
};

module.exports = {
    rpcServiceName: 'emailNotificationService',
    subExchanges,
    emailTemplates,
    serviceName: 'emailNotificationService',
};