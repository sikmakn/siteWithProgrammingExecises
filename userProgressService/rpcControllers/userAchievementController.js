const userAchievementService = require('../services/userAchievementService');
const achievementService = require('../services/achievementService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'userAchievement',
    methods: [
        {
            name: 'getByUsername',
            method: async (msg, res) => {
                try {
                    const {achievements: achievementsIds} = await userAchievementService.findByUsername(msg.username);
                    if (!achievementsIds || !achievementsIds.length) return res({result: []});

                    const achievements = await achievementService.findManyByIds(achievementsIds);
                    if (!achievements) return res({result: []});
                    res({
                        result: achievements.map(ach => ({
                            _id: ach._id,
                            name: ach.name,
                            fileId: ach.fileId,
                            previewFileId: ach.previewFileId,
                            description: ach.description,
                        }))
                    });
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};