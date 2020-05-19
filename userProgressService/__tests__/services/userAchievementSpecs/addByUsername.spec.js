const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');

const exerciseResultService = require('../../../services/exerciseResultService');
jest.mock('../../../services/exerciseResultService');

const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');

const mongoose = require('mongoose');
const userAchievementService = require('../../../services/userAchievementService');


describe('addByUsername function', () => {
    const username = 'username1';
    let achievements;
    let addedAchievements;
    let userResults;

    const theme1Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a2");
    const exercise1Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a4");
    const theme2Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a3");
    const exercise2Id = mongoose.Types.ObjectId("5ec04cb26111a51dc81f09a5");

    beforeEach(() => {
        userResults = [
            {
                themeId: theme1Id,
                result: 'correct',
                difficulty: 'easy',
                username: 'username1',
                exerciseId: exercise1Id,
            },
            {
                themeId: theme1Id,
                result: 'uncorrect',
                difficulty: 'easy',
                username: 'username1',
                exerciseId: exercise2Id,
            },
            {
                themeId: theme2Id,
                result: 'correct',
                difficulty: 'easy',
                username: 'username1',
                exerciseId: exercise1Id,
            },
            {
                themeId: theme2Id,
                result: 'uncorrect',
                difficulty: 'easy',
                username: 'username1',
                exerciseId: exercise2Id,
            },
        ];
        exerciseResultService.findByUsername.mockReturnValue(userResults);

        achievements = [
            {
                _id: 'achievement1Id',
                conditions: [
                    {themeId: theme1Id, count: 2},
                    {exerciseId: exercise1Id, result: 'correct'},
                    {result: 'correct', count: 1}
                ],
            },
            {
                _id: 'achievement2Id',
                conditions: [
                    {themeId: theme1Id, difficulty: 'easy', count: 2},
                    {exerciseId: exercise2Id},
                    {exerciseId: exercise2Id, difficulty: 'easy'}
                ],
            }
        ];
        achievementService.findMany.mockReturnValue(achievements);

        addedAchievements = {_doc: 'doc'};
        userAchievementRepository.addAchievements.mockReturnValue(addedAchievements);
    });

    test('userAchievementRepository.addAchievements should be called', async () => {
        await userAchievementService.addByUsername(username);
        expect(userAchievementRepository.addAchievements).toBeCalled();
    });

    test('should throw error', () => {
        const error = new Error('not group');
        achievementService.findMany.mockReturnValue(Promise.reject(error));
        expect(userAchievementService.addByUsername(username)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.addByUsername(username);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

    test('get right result', async () => {
        let achievementIdsResult = [];
        userAchievementRepository.addAchievements.mockImplementation(({achievementIds}) => {
            achievementIdsResult = achievementIds;
            return addedAchievements;
        });

        await userAchievementService.addByUsername(username);
        expect(achievementIdsResult).toBeDefined();
        expect(achievementIdsResult).toBeTruthy();
        expect(achievementIdsResult.length).toBe(2);
        expect(achievementIdsResult).toEqual(['achievement1Id', 'achievement2Id']);
    });

    test('not add falsy exercise condition achievements', async () => {
        achievements.push({
            _id: 'achievement3Id',
            conditions: [
                {exerciseId: 'notExistExerciseId'},
                {difficulty: 'easy'}
            ],
        });
        achievementService.findMany.mockReturnValue(achievements);

        let achievementIdsResult = [];
        userAchievementRepository.addAchievements.mockImplementation(({achievementIds}) => {
            achievementIdsResult = achievementIds;
            return addedAchievements;
        });

        await userAchievementService.addByUsername(username);
        expect(achievementIdsResult).toBeDefined();
        expect(achievementIdsResult).toBeTruthy();
        expect(achievementIdsResult.length).toBe(2);
        expect(achievementIdsResult).toEqual(['achievement1Id', 'achievement2Id']);
    });

    test('work without commonCondition', async () => {
        achievements = [
            {
                _id: 'achievement1Id',
                conditions: [
                    {exerciseId: exercise1Id, result: 'correct'},
                ],
            },
        ];
        achievementService.findMany.mockReturnValue(achievements);

        let achievementIdsResult = [];
        userAchievementRepository.addAchievements.mockImplementation(({achievementIds}) => {
            achievementIdsResult = achievementIds;
            return addedAchievements;
        });

        await userAchievementService.addByUsername(username);

        expect(achievementIdsResult).toBeDefined();
        expect(achievementIdsResult).toBeTruthy();
        expect(achievementIdsResult.length).toBe(1);
        expect(achievementIdsResult).toEqual(['achievement1Id']);
    });

    test('not add falsy common condition achievements', async () => {
        achievements.push({
            _id: 'achievement3Id',
            conditions: [
                {difficulty: 'hard', count: 1}
            ],
        });
        achievementService.findMany.mockReturnValue(achievements);

        let achievementIdsResult = [];
        userAchievementRepository.addAchievements.mockImplementation(({achievementIds}) => {
            achievementIdsResult = achievementIds;
            return addedAchievements;
        });

        await userAchievementService.addByUsername(username);

        expect(achievementIdsResult).toBeDefined();
        expect(achievementIdsResult).toBeTruthy();
        expect(achievementIdsResult.length).toBe(2);
        expect(achievementIdsResult).toEqual(['achievement1Id', 'achievement2Id']);
    });

    test('right without exercise conditions', async () => {
        achievements = [
            {
                _id: 'achievement1Id',
                conditions: [
                    {themeId: theme1Id, result: 'correct', count: 1},
                ],
            },
        ];
        achievementService.findMany.mockReturnValue(achievements);

        let achievementIdsResult = [];
        userAchievementRepository.addAchievements.mockImplementation(({achievementIds}) => {
            achievementIdsResult = achievementIds;
            return addedAchievements;
        });

        await userAchievementService.addByUsername(username);

        expect(achievementIdsResult).toBeDefined();
        expect(achievementIdsResult).toBeTruthy();
        expect(achievementIdsResult.length).toBe(1);
        expect(achievementIdsResult).toEqual(['achievement1Id']);
    });

});