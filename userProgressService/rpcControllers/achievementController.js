const achievementService = require('../services/achievementService');
const userAchievementService = require('../services/userAchievementService');

module.exports = {
    name: 'achievement',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const achievement = await achievementService.create(msg);
                    await userAchievementService.addByConditions(achievement.conditions, achievement._id);
                    res(achievement);
                } catch (e) {
                    res(e);
                }
            }
        },
        {
            name: 'getAchievement',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    const {name, description, _id, fileId, previewFileId} = await achievementService.findById(id);
                    res({name, description, _id, fileId, previewFileId});
                } catch (e) {
                    res(e);
                }
            }
        },
        {
            name: 'getAchievementFile',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    res(await achievementService.findFile(id));
                } catch (e) {
                    res(e);
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
                    res(results);
                } catch (e) {
                    res(e);
                }
            }
        },
        {
            name: 'updateAchievementById',
            method: async (msg, res) => {
                try {
                    const updatedAchievement = await achievementService.updateById(msg);
                    await userAchievementService.addByConditions(updatedAchievement.conditions, updatedAchievement._id);
                    res(updatedAchievement);
                } catch (e) {
                    res(e);
                }
            }
        },
        {
            name: 'updateAchievementFile',
            method: async (msg, res) => {
                try {
                    const updatedAchievement = await achievementService.updateFile(msg);
                    res(updatedAchievement);
                } catch (e) {
                    res(e);
                }
            }
        }
    ]
};