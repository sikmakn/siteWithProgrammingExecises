const userAchievementRepository = require('../db/repositories/userAchievementRepository');
const exerciseResultService = require('./exerciseResultService');
const achievementService = require('./achievementService');
const {achievementFields} = require('../options');
const getCombinations = require('../helpers/combinations');
const {isArrsEquals} = require('../helpers/arrayHelps');
const {v4: uuidv4} = require('uuid');
const {publish, getChannel} = require('../amqpHandler');
const {pubExchanges} = require('../options');

async function addAchievements({username, achievementIds}) {
    const userAchievement = (await userAchievementRepository.addAchievements({username, achievementIds}))?._doc;
    await publish(await getChannel(), pubExchanges.newUserAchievement, {userIds: [username], achievementIds});
    return userAchievement;
}

async function addAchievementsToManyUsers({usernames, achievementIds}) {
    const usersAchievements = await userAchievementRepository.addAchievementsToManyUsers({usernames, achievementIds});
    await publish(await getChannel(), pubExchanges.newUserAchievement, {userIds: usernames, achievementIds});
    return usersAchievements;
}

async function deleteAchievements({username, achievementIds}) {
    return (await userAchievementRepository.deleteAchievements({username, achievementIds}))?._doc;
}

async function findByUsername(username) {
    return (await userAchievementRepository.findByUsername(username))?._doc;
}

async function addByUsername(username) {
    const userResults = await exerciseResultService.findByUsername(username);
    const allAchievements = await achievementService.findMany({achievementForFind: {}});
    const achievementIds = [];
    for (let {conditions, _id} of allAchievements) {
        const exerciseConditions = conditions.filter(c => c.exerciseId);
        if (!containAllExerciseConditions({exerciseConditions, userResults})) continue;

        const commonConditions = conditions.filter(c => !c.exerciseId);
        if (!commonConditions.length || checkCommonConditions({commonConditions, userResults}))
            achievementIds.push(_id);

    }
    if (achievementIds.length)
        return await addAchievements({username, achievementIds});
}

async function addByConditions(conditions, achievementId) {
    const commonConditions = conditions.filter(f => !f.exerciseId).map(m => m._doc);
    const facetArr = makeFacetObjToCommonConditions(commonConditions);

    const exerciseConditions = conditions.filter(f => f.exerciseId).map(m => m._doc);
    addExerciseAggregateArr(exerciseConditions, facetArr);

    const results = await exerciseResultService.aggregate([
        {$facet: facetArr},
        {$project: {usernames: {$setIntersection: Object.keys(facetArr).map(m => `$${m}`)}}}
    ]);

    const usernames = results[0].usernames.map(obj => obj._id);
    if (usernames.length)
        return await addAchievementsToManyUsers({usernames, achievementIds: [achievementId]});
}

async function deleteAchievementFromAll(achievementId) {
    return await userAchievementRepository.deleteAchievementFromAll(achievementId);
}

module.exports = {
    addByUsername,
    findByUsername,
    addByConditions,
    addAchievements,
    deleteAchievements,
    deleteAchievementFromAll,
    addAchievementsToManyUsers,
};

function findUserResults({themeId, difficulty, result, userResults}) {
    return userResults.filter(r => {
        let res = true;
        if (themeId) res = themeId.toString() === r.themeId.toString();
        if (difficulty) res = res && r.difficulty === difficulty;
        if (result) res = res && r.result === result;
        return res;
    });
}

function checkCommonConditions({commonConditions, userResults}) {
    let countOfTruth = 0;
    for (let {themeId, difficulty, result, count} of commonConditions) {
        const userResultsByCondition = findUserResults({
            userResults,
            themeId,
            difficulty,
            result,
        });
        if (userResultsByCondition.length < count) break;

        countOfTruth++;
    }
    return countOfTruth === commonConditions.length;
}

function containAllExerciseConditions({exerciseConditions, userResults}) {
    return exerciseConditions.every(c => userResults.find(r => {
        let res = c.exerciseId.toString() === r.exerciseId.toString();
        if (c.difficulty) res = res && r.difficulty === c.difficulty;
        if (c.result) res = res && r.result === c.result;
        return res;
    }));
}

function getGroupIdObj(combination) {
    const idFields = {username: '$username'};
    combination.forEach(f => idFields[f] = `$${f}`);
    return idFields
}

function getMatchAggregateConditions(combination, conditions) {
    const combWithCount = [...combination, 'count'];
    return conditions
        .map(el => {
            let {_id, ...rest} = el;
            return rest;
        })
        .filter(el => isArrsEquals(Object.keys(el), combWithCount))
        .map(c => {
            const matchCond = {};
            Object.keys(c).forEach(k => {
                if (k !== 'count') matchCond[`_id.${k}`] = c[k];
            });
            matchCond.count = {$gte: c.count};
            return matchCond;
        });
}

function getCommonAggregateArr(idFields, commonConditions) {
    return [
        {$group: {_id: idFields, count: {$sum: 1}}},
        {$match: {$or: commonConditions}},
        {$group: {_id: "$_id.username", number: {$sum: 1}}},
        {$match: {number: {$gte: commonConditions.length}}},
        {$group: {_id: "$_id"}}
    ];
}

function addExerciseAggregateArr(exerciseConditions, facetArr) {
    if (exerciseConditions.length) facetArr['exercise'] = [
        {$match: {$or: exerciseConditions}},
        {$group: {_id: {username: '$username'}, count: {$sum: 1}}},
        {$match: {count: {$gte: exerciseConditions.length}}},
        {$group: {_id: "$_id.username"}}
    ];
}

function makeFacetObjToCommonConditions(conditions) {
    const combinations = getCombinations(achievementFields, achievementFields.length);
    const facetArr = {};
    for (let comb of combinations) {
        const matchConditions = getMatchAggregateConditions(comb, conditions);
        if (!matchConditions.length) continue;

        const idFields = getGroupIdObj(comb);
        const facetName = uuidv4().toString();
        facetArr[facetName] = getCommonAggregateArr(idFields, matchConditions);
    }
    return facetArr;
}