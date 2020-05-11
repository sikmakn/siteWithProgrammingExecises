const achievementService = require('../services/achievementService');

module.exports = {
    name: 'achievement',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                const achievement = await achievementService.create(msg);
                res(achievement);
            }
        },
        {
            name: 'getAchievement',
            method: async (msg, res) => {
                const {id} = msg;
                const {fileName, name, description} = await achievementService.findById(id);
                res({fileName, name, description});
            }
        },
        {
            name: 'getAchievementFile',
            method: async (msg, res) => {
                const {id} = msg;
                const file = await achievementService.findAchievementFile(id);
                res(file);
            }
        },
        {
            name: 'getManyAchievements',
            method: async (msg, res) => {
                const achievements = await achievementService.findAchievements(msg);
                const results = achievements.map(ach => ({
                    _id: ach._id,
                    name: ach.name,
                    fileId: ach.fileId,
                    description: ach.description,
                }));
                res(results);
            }
        },
        {
            name: 'updateAchievementById',
            method: async (msg, res) => {
                const updatedAchievement = await achievementService.updateById(msg);
                res(updatedAchievement);
            }
        },
        {
            name: 'updateAchievementFile',
            method: async (msg, res) => {
                const updatedAchievement = await achievementService.updateAchievementFile(msg);
                res(updatedAchievement);
            }
        }
    ]
};