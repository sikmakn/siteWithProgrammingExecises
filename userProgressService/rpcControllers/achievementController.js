const achievementService = require('../services/achievementService');
const userAchievementService = require('../services/userAchievementService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'achievement',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const achievement = await achievementService.create(msg);
                    await userAchievementService.addByConditions(achievement.conditions, achievement._id);
                    res({result: achievement});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getAchievement',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    const {name, description, _id, fileId, previewFileId} = await achievementService.findById(id);
                    res({result: {name, description, _id, fileId, previewFileId}});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getAchievementFile',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    res({result: await achievementService.findFile(id)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getManyAchievements',
            method: async (msg, res) => {
                try {
                    const achievements = await achievementService.findMany(msg);
                    const results = achievements.map(ach => ({
                        _id: ach._id,
                        name: ach.name,
                        fileId: ach.fileId,
                        description: ach.description,
                        previewFileId: ach.previewFileId,
                    }));
                    res({result: results});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'updateAchievementById',
            method: async (msg, res) => {
                try {
                    const updatedAchievement = await achievementService.updateById(msg);
                    await userAchievementService.addByConditions(updatedAchievement.conditions, updatedAchievement._id);
                    res({result: updatedAchievement});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'updateAchievementFile',
            method: async (msg, res) => {
                try {
                    res({result: await achievementService.updateFile(msg)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        }
    ]
};