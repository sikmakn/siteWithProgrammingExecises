const emailService = require('../services/emailService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = [
    {
        subExchange: 'blockUser',
        method: async (content) => {
            try {
                if (content.isBlocked) {
                    await emailService.sendBlockMail(content);
                } else {
                    await emailService.sendUnblockMail(content);
                }
            } catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error, date: Date.now(), serviceName});
            }
        },
    },
];
