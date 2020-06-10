const achievementService = require('../services/achievementService');
const userAchievementService = require('../services/userAchievementService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');
const {Types} = require('mongoose');

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
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid ObjectId'))});

                    const achievement = await achievementService.findById(id);
                    if (!achievement) return res({result: achievement});

                    const {name, description, _id, fileId, previewFileId} = achievement;
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
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid ObjectId'))});

                    const file = await achievementService.findFile(id);
                    if (file) return res({result: file});

                    res({error: serializeError(new Error('Not found file'))});
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
                    const {fileId} = msg;
                    if (!Types.ObjectId.isValid(fileId))
                        return res({error: serializeError(new Error('Not valid fileId'))});
                    res({result: await achievementService.updateFile(msg)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'deleteAchievementById',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    const result = await Promise.all([
                        achievementService.deleteAchievementById(id),
                        userAchievementService.deleteAchievementFromAll(id),
                    ]);
                    res({result});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'deleteFileById',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    res({result: await achievementService.deleteFileById(id)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        }
    ]
};