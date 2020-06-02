const newUserAchievementsService = require('../services/newUserAchievementsService');

module.exports = [
    {
        subExchange: 'newUserAchievement',
        method: async (content) => {
            const {userIds, achievementIds} = content;
            await newUserAchievementsService.createOrUpdateMany({userIds, count: achievementIds.length});
        },
    },
];
