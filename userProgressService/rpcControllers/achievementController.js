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
                    res({result: achievement});
                } catch (e) {
                    res({error: e});
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
                } catch (e) {
                    res({error: e});
                }
            }
        },
        {
            name: 'getAchievementFile',
            method: async (msg, res) => {
                try {
                    const {id} = msg;
                    res({result: await achievementService.findFile(id)});
                } catch (e) {
                    res({error: e});
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
                } catch (e) {
                    res({error: e});
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
                } catch (e) {
                    res({error: e});
                }
            }
        },
        {
            name: 'updateAchievementFile',
            method: async (msg, res) => {
                try {
                    res({result: await achievementService.updateFile(msg)});
                } catch (e) {
                    res({error: e});
                }
            }
        }
    ]
};