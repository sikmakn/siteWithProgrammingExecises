const exerciseResultService = require('../services/exerciseResultService');
const userAchievementService = require('../services/userAchievementService');

module.exports = [
    {
        subExchange: 'exerciseTests',
        method: async (content) => {
            const {username, difficulty, themeId, exerciseId, sourceCode, results} = content;
            await exerciseResultService.findOneAndUpdate({
                findParams: {username, themeId, exerciseId},
                updatedExercise: {username, difficulty, themeId, exerciseId, sourceCode},
                results,
            });
            await userAchievementService.addByUsername(username);
        },
    },
];
