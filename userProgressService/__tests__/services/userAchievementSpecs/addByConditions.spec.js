const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');

const exerciseResultService = require('../../../services/exerciseResultService');
jest.mock('../../../services/exerciseResultService');

const mongoose = require('mongoose');
const userAchievementService = require('../../../services/userAchievementService');


describe('addByConditions function', () => {
    let achievementId;
    let conditions;
    let addedAchievements;
    let aggregateReturnValue = [{usernames: ['username1']}];

    beforeEach(() => {
        achievementId = 'achievementId';
        const theme1Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a2");
        const theme2Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a3");
        const exercise1Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a4");
        const exercise2Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a5");
        conditions = [
            {themeId: theme1Id, count: 2},
            {themeId: theme2Id, count: 1},
            {themeId: theme1Id, result: 'correct', count: 1},
            {themeId: theme1Id, difficulty: 'easy', count: 1},
            {themeId: theme1Id, result: 'correct', difficulty: 'easy', count: 1},
            {result: 'correct', difficulty: 'easy', count: 2},
            {result: 'correct', count: 2},
            {difficulty: 'easy', count: 2},
            {exerciseId: exercise1Id, difficulty: 'easy'},
            {exerciseId: exercise2Id, difficulty: 'easy'}
        ].map(c => ({_doc: c}));

        exerciseResultService.aggregate.mockReturnValue(aggregateReturnValue);

        addedAchievements = [];
        userAchievementRepository.addAchievementsToManyUsers.mockReturnValue(addedAchievements);
    });

    test('userAchievementRepository.addAchievementsToManyUsers should be called', async () => {
        await userAchievementService.addByConditions(conditions, achievementId);
        expect(userAchievementRepository.addAchievementsToManyUsers).toBeCalled();
    });

    test('should throw error', () => {
        const error = new Error('not group');
        exerciseResultService.aggregate.mockReturnValue(Promise.reject(error));
        expect(userAchievementService.addByConditions(conditions, achievementId)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.addByConditions(conditions, achievementId);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

    test('get truthy aggregateObject', async () => {
        let aggregateParams = [];
        exerciseResultService.aggregate.mockImplementation(params => {
            aggregateParams = params;
            return aggregateReturnValue;
        });
        await userAchievementService.addByConditions(conditions, achievementId);
        expect(aggregateParams.length).toBe(2);
        const facet = aggregateParams[0]['$facet'];
        expect(facet).toBeDefined();
        expect(facet).toBeTruthy();
        const project = aggregateParams[1]['$project'];
        expect(project).toBeDefined();
        expect(project).toBeTruthy();
        expect(Object.keys(project)).toContain('usernames');
        expect(Object.keys(project.usernames)).toContain('$setIntersection');
    });

    test('exerciseAchievements get allCombination aggregateObject', async () => {
        let aggregateParams = [];
        exerciseResultService.aggregate.mockImplementation(params => {
            aggregateParams = params;
            return aggregateReturnValue;
        });

        await userAchievementService.addByConditions(conditions, achievementId);

        expect(aggregateParams.length).toBe(2);
        const facet = aggregateParams[0]['$facet'];
        const project = aggregateParams[1]['$project'];
        expect(Object.keys(facet).length).toBe(project.usernames['$setIntersection'].length);
    });

    test('exerciseAchievements not add empty combination conditions', async () => {
        conditions = [
            {_doc: {difficulty: 'easy', count: 2}},
        ];

        let aggregateParams = [];
        exerciseResultService.aggregate.mockImplementation(params => {
            aggregateParams = params;
            return aggregateReturnValue;
        });

        await userAchievementService.addByConditions(conditions, achievementId);

        expect(aggregateParams.length).toBe(2);
        const facet = aggregateParams[0]['$facet'];
        expect(Object.keys(facet).length).toBe(1);
    });

});