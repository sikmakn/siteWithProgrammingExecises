const userAchievementRepository = require('../db/repositories/userAchievementRepository');
const exerciseResultService = require('./exerciseResultService');
const achievementService = require('./achievementService');
const {achievementFields} = require('../options');
const getCombinations = require('../helpers/combinations');
const {isArrsEquals} = require('../helpers/arrayHelps');
const {v4: uuidv4} = require('uuid');

async function addAchievements({username, achievementIds}) {
    const userAchievement = await userAchievementRepository.addAchievements({username, achievementIds});
    //todo push
    return userAchievement._doc;
}

async function addAchievementsToManyUsers({usernames, achievementIds}) {
    const usersAchievements = await userAchievementRepository.addAchievementsToManyUsers(usernames, achievementIds);
    //todo push
    return usersAchievements;
}

async function deleteAchievements({username, achievementIds}) {
    const userAchievement = await userAchievementRepository.deleteAchievements({username, achievementIds});
    return userAchievement._doc;
}

async function findByUsername(username) {
    const userAchievement = await userAchievementRepository.findByUsername(username);
    return userAchievement._doc;
}

async function addByUsername(username) {
    const userResults = await exerciseResultService.findByUsername(username);
    const allAchievements = await achievementService.findMany({achievementForFind: {}});

    const achievementIds = [];
    for (let achievement of allAchievements) {
        const conditions = achievement.conditions;
        const exerciseConditions = conditions.filter(c => c.exerciseId);
        if (!containAllExerciseConditions({exerciseConditions, userResults})) continue;

        const commonConditions = conditions.filter(c => !c.exerciseId);
        if (!commonConditions.length) {
            achievementIds.push(achievement._id);
            continue;
        }
        if (checkCommonConditions({conditions: commonConditions, userResults}))
            achievementIds.push(achievement._id);
    }
    return await addAchievements({username, achievementIds});
}

async function addByConditions(conditions, achievementId) {
    const combinations = getCombinations(achievementFields, achievementFields.length);

    const exerciseConditions = conditions.filter(f => f.exerciseId);
    conditions = conditions.filter(f => !f.exerciseId);

    const facetArr = {};
    for (let comb of combinations) {

        const matchConditions = getMatchAggregateConditions(comb, conditions);
        if (!matchConditions.length) continue;

        const idFields = getGroupIdObj(comb);

        const facetName = uuidv4().toString();
        facetArr[facetName] = getCommonAggregateArr(idFields, matchConditions);
    }
    if (exerciseConditions.length) facetArr['exercise'] = getExerciseAggregateArr(exerciseConditions);

    const results = await exerciseResultService.aggregate([
        {$facet: facetArr},
        {$project: {usernames: {$setIntersection: Object.keys(facetArr).map(m => `$${m}`)}}}
    ]);
    const usernames = results[0].usernames.map(obj => obj._id);
    return await addAchievementsToManyUsers({usernames, achievementIds: [achievementId]});
}

module.exports = {
    addByUsername,
    findByUsername,
    addByConditions,
    addAchievements,
    deleteAchievements,
    addAchievementsToManyUsers,
};

function findUserResults({themeId, difficulty, result, userResults}) {
    return userResults.filter(r => {
        let res = true;
        if (themeId) res = themeId === r.themeId;
        if (difficulty) res = res && r.difficulty === difficulty;
        if (result) res = res && r.result === result;
        return res;
    });
}

function checkCommonConditions({conditions, userResults}) {
    let countOfTruth = 0;
    for (let condition of conditions) {
        const {themeId, difficulty, result, count} = condition;
        const userResultsByCondition = findUserResults({
            userResults,
            themeId,
            difficulty,
            result,
        });

        if (userResultsByCondition.length < count) break;

        countOfTruth++;
    }
    return countOfTruth === conditions.length;
}

function containAllExerciseConditions({exerciseConditions, userResults}) {
    return exerciseConditions.every(c => userResults.find(r => {
        let res = c.exerciseId === r.exerciseId;
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

function getExerciseAggregateArr(exerciseConditions) {
    return [
        {$match: {$or: exerciseConditions}},
        {$group: {_id: {username: '$username'}, count: {$sum: 1}}},
        {$match: {count: {$gte: exerciseConditions.length}}},
        {$group: {_id: "$_id.username"}}
    ]
}
