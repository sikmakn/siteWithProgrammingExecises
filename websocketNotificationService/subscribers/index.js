const newUserAchievementsService = require('../services/newUserAchievementsService');

module.exports = [
    {
        subExchange: 'newUserAchievement',
        method: async (content) => {
            const {name, userId} = content;

        },
    },
];
