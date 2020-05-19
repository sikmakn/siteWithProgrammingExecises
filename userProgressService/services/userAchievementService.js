const userAchievementRepository = require('../db/repositories/userAchievementRepository');
const exerciseResultService = require('./exerciseResultService');
const achievementService = require('./achievementService');

async function addAchievements({username, achievementIds}) {
    const userAchievement = await userAchievementRepository.addAchievements({username, achievementIds});
    //todo push
    return userAchievement._doc;
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
    const allAchievements = await achievementService.findMany({achievementFotFind: {}});
    const promises = [];

    for (let achievement of allAchievements) {
        const conditions = achievement.conditions;

        const exerciseConditions = conditions.filter(c => c.exerciseId);
        if (!isExerciseConditions({exerciseConditions, userResults})) continue;

        const themeConditions = conditions.filter(c => c.themeId);
        const getExerciseResults = ({themeId, difficulty, result}) => userResults.filter(r => {
            let res = themeId === r.themeId;
            if (difficulty) res = res && r.difficulty === difficulty;
            if (result) res = res && r.result === result;
            return res;
        });

        if (!themeConditions.length || await checkThemeConditions({themeConditions, username, getExerciseResults})) {
            let achievementPromise = addAchievements({username, achievementIds: [achievement._id]});
            promises.push(achievementPromise);
        }

    }
    return await Promise.all(promises);
}

async function addByConditions(conditions, achievementId) {//todo check

    //  const exerciseConditions = conditions.filter(c => c.exerciseId);
    //  const exerciseResults = await exerciseResultService.groupByUsername(exerciseConditions);
    //  const exerciseUsernames = exerciseResults.filter(r => r.count >= conditions.length).map(r => r.username);
    //
    //  const themeConditions = conditions.filter(c => c.themeId);
    //  //todo check repository
    //  const themeConditionsWithoutCount = themeConditions.filter(c => c.count === undefined);
    //  const themeResults = await exerciseResultService.groupByUsername(themeConditionsWithoutCount);
    //  const themeConditionsWithCount = themeConditions.filter(c => c.count !== undefined);
    //  for (let fullCondition of themeConditionsWithCount) {
    //      const condition = {};
    //      Object.assign(condition, fullCondition);
    //      delete condition.count;
    //      const themeResultsByCondition = await exerciseResultService.groupByUsername([condition]);
    //      const results = themeResultsByCondition.filter( r => r.count >= fullCondition.count);
    //      themeResults.push(...results);
    //  }
    // // const themeResults = await exerciseResultService.groupByUsername(themeConditions);
    //  const themeUsernames = themeResults.filter(r => r.count >= conditions.length).map(r => r.username);
    //
    //  const resultUsernames = exerciseUsernames.filter(ex => themeUsernames.includes(ex));
    //  const promises = resultUsernames.map(username => addAchievements({username, achievementIds: [achievementId]}));
    //
    //  // const usernames = exerciseResults.filter(r => r.count >= conditions.length).map(r => r.username);
    //  // const getExerciseResults = async ({username, themeId, difficulty, result}) =>
    //  //     await exerciseResultService.find({username, themeId, difficulty, result});
    //  //
    //  // for (let username of usernames) {
    //  //     if (themeConditions.length
    //  //         && !await checkThemeConditions({themeConditions, username, getExerciseResults})) break;
    //  //
    //  //     let achievementPromise = addAchievements({username, achievementIds: [achievementId]});
    //  //     promises.push(achievementPromise);
    //  // }
    //  return await Promise.all(promises);

}

module.exports = {
    findByUsername,
    addAchievements,
    deleteAchievements,
    addByConditions,
    addByUsername,
};

function isExerciseConditions({exerciseConditions, userResults}) {
    return exerciseConditions.every(c => userResults.find(r => {
        let res = c.exerciseId === r.exerciseId;
        if (c.difficulty) res = res && r.difficulty === c.difficulty;
        if (c.result) res = res && r.result === c.result;
        return res;
    }));
}

async function checkThemeConditions({themeConditions, username, getExerciseResults}) {
    let countOfTruth = 0;
    for (let condition of themeConditions) {
        const {themeId, difficulty, count, result} = condition;
        const userResults = await getExerciseResults({
            username,
            themeId,
            difficulty,
            result,
        });
        if (!count && userResults.length) {
            countOfTruth++;
            continue;
        }
        if (userResults.length !== count) break;

        countOfTruth++;
    }
    return countOfTruth === themeConditions.length;
}