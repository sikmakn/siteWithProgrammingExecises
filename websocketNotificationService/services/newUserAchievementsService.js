const newAchievementsRepository = require('../db/repositories/newAchievementsRepository');
const {getElementsByUserId} = require('../connectionMap');

async function createOrUpdate({userId, count}) {
    const result = await newAchievementsRepository.update({userId, updateQuery: {$inc: {count}}});
    const ws = getElementsByUserId({userId});
    ws.send(result.count);
    return result;
}

async function createOrUpdateMany({userIds, count}) {
    const queryObjArr = userIds.map(userId => ({updateOne: {filter: {userId}, update: {$inc: {count}}, upsert: true}}));
    await newAchievementsRepository.createOrUpdateMany(queryObjArr);
    const results = await newAchievementsRepository.findMany({userIds});
    results.forEach(({userId, count}) => {
        const wsArr = getElementsByUserId({userId});
        wsArr.forEach(ws => ws.send(count));
    });
    return results;
}

async function getCount({userId}) {
    const result = await newAchievementsRepository.findByUserId(userId);
    return result?.count;
}

async function readNotification({userId}) {
    return await newAchievementsRepository.deleteByUserId(userId);
}

module.exports = {
    getCount,
    createOrUpdate,
    readNotification,
    createOrUpdateMany,
};