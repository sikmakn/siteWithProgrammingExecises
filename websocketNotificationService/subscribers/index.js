const newUserAchievementsService = require('../services/newUserAchievementsService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = [
    {
        subExchange: 'newUserAchievement',
        method: async (content) => {
            try {
                const {userIds, achievementIds} = content;
                await newUserAchievementsService.createOrUpdateMany({userIds, count: achievementIds.length});
            }catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error, date: Date.now(), serviceName});
            }
        },
    },
];
