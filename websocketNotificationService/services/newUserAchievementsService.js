const newAchievementsRepository = require('../db/repositories/newAchievementsRepository');
const {getElementsByUserId} = require('../connectionMap');

async function createOrUpdate({userId, achievementIds}) {
    const result = await newAchievementsRepository.update({userId, updateQuery: {$push: {achievementIds}}});
    const ws = getElementsByUserId({userId});
    ws.send(result.count);
    return result;
}

async function createOrUpdateMany({userAchievements}) {
    const queryObjArr = userAchievements.map(({username, achievementIds}) => ({
        updateOne: {
            filter: {userId: username},
            update: {$push: {achievementIds}},
            upsert: true,
        }
    }));
    await newAchievementsRepository.createOrUpdateMany(queryObjArr);

    const userIds = userAchievements.map(({username}) => username);
    const results = await newAchievementsRepository.findMany({userIds});
    results.forEach(({userId, achievementIds}) =>
        getElementsByUserId({userId}).forEach(ws => ws.send(achievementIds.length)));
    return results;
}

async function getCount({userId}) {
    const result = await newAchievementsRepository.findByUserId(userId);
    return result?.achievementIds?.length ?? 0;
}

async function readNotificationsByUserId({userId}) {
    getElementsByUserId({userId}).forEach(ws => ws.send(0));
    return await newAchievementsRepository.deleteByUserId(userId);
}

async function getIdsByUserId({userId}) {
    return (await newAchievementsRepository.findByUserId(userId))?.achievementIds ?? [];
}

module.exports = {
    getCount,
    createOrUpdate,
    getIdsByUserId,
    readNotificationsByUserId,
    createOrUpdateMany,
};