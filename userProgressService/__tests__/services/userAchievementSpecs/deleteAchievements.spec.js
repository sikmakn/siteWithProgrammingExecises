const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');
const userAchievementService = require('../../../services/userAchievementService');

describe('deleteAchievements function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {username: 'username', achievementIds: []};
        achievementFindResult = {_doc: 'doc'};
        userAchievementRepository.deleteAchievements.mockReturnValue(achievementFindResult);
    });

    test('userAchievementRepository.deleteAchievements should be called', async () => {
        await userAchievementService.deleteAchievements(msg);
        expect(userAchievementRepository.deleteAchievements).toBeCalled();
    });

    test('userAchievementRepository throw error', () => {
        const error = new Error('not created');
        userAchievementRepository.deleteAchievements.mockImplementation(() => Promise.reject(error));
        expect(userAchievementService.deleteAchievements(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.deleteAchievements(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});