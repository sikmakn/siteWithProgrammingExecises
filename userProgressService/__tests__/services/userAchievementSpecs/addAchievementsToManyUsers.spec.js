const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');
const userAchievementService = require('../../../services/userAchievementService');

describe('addAchievementsToManyUsers function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {usernames: ['username'], achievementIds: []};
        achievementFindResult = {_doc: 'doc'};
        userAchievementRepository.addAchievementsToManyUsers.mockReturnValue(achievementFindResult);
    });

    test('userAchievementRepository.addAchievementsToManyUsers should be called', async () => {
        await userAchievementService.addAchievementsToManyUsers(msg);
        expect(userAchievementRepository.addAchievementsToManyUsers).toBeCalled();
    });

    test('userAchievementRepository throw error', () => {
        const error = new Error('not created');
        userAchievementRepository.addAchievementsToManyUsers.mockImplementation(() => Promise.reject(error));
        expect(userAchievementService.addAchievementsToManyUsers(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.addAchievementsToManyUsers(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});