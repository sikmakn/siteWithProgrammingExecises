const exerciseResultService = require('../services/exerciseResultService');
const userAchievementService = require('../services/userAchievementService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = [
    {
        subExchange: 'exerciseTests',
        method: async (content) => {
            try {
                const {username, difficulty, themeId, exerciseId, sourceCode, results} = content;
                await exerciseResultService.findOneAndUpdate({
                    findParams: {username, themeId, exerciseId},
                    updatedExercise: {username, difficulty, themeId, exerciseId, sourceCode},
                    results,
                });
                await userAchievementService.addByUsername(username);
            } catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error, date: Date.now(), serviceName});
            }
        },
    },
];
