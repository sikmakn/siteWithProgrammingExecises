const userAchievementService = require('../services/userAchievementService');
const achievementService = require('../services/achievementService');

module.exports = {
    name: 'userAchievement',
    methods: [
        {
            name: 'getByUsername',
            method: async (msg, res) => {
                try {
                    const {achievements: achievementsIds} = await userAchievementService.findByUsername(msg.username);
                    if (!achievementsIds || !achievementsIds.length) {
                        res({result: []});
                        return;
                    }
                    const achievements = (await achievementService.findManyByIds(achievementsIds)).map(ach => ({
                        _id: ach._id,
                        name: ach.name,
                        fileId: ach.fileId,
                        previewFileId: ach.previewFileId,
                        description: ach.description,
                    }));
                    res({result: achievements});
                } catch (e) {
                    res(e);
                }
            }
        },
    ]
};