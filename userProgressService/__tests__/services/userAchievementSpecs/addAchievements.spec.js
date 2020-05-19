const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');
const userAchievementService = require('../../../services/userAchievementService');

describe('addAchievements function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {username: 'username', achievementIds: []};
        achievementFindResult = {_doc: 'doc'};
        userAchievementRepository.addAchievements.mockReturnValue(achievementFindResult);
    });

    test('userAchievementRepository.addAchievements should be called', async () => {
        await userAchievementService.addAchievements(msg);
        expect(userAchievementRepository.addAchievements).toBeCalled();
    });

    test('userAchievementRepository throw error', () => {
        const error = new Error('not created');
        userAchievementRepository.addAchievements.mockImplementation(() => Promise.reject(error));
        expect(userAchievementService.addAchievements(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.addAchievements(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});