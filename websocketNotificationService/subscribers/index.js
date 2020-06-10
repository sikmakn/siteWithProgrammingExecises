const newUserAchievementsService = require('../services/newUserAchievementsService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = [
    {
        subExchange: 'newUserAchievement',
        method: async ({userAchievements}) => {
            try {
                await newUserAchievementsService.createOrUpdateMany({userAchievements});
            } catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error: serializeError(error), date: Date.now(), serviceName});
            }
        },
    },
];
