const userAchievementRepository = require('../../../db/repositories/userAchievementRepository');
jest.mock('../../../db/repositories/userAchievementRepository');
const userAchievementService = require('../../../services/userAchievementService');

describe('findByUsername function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {username: 'username', achievementIds: []};
        achievementFindResult = {_doc: 'doc'};
        userAchievementRepository.findByUsername.mockReturnValue(achievementFindResult);
    });

    test('userAchievementRepository.findByUsername should be called', async () => {
        await userAchievementService.findByUsername(msg);
        expect(userAchievementRepository.findByUsername).toBeCalled();
    });

    test('userAchievementRepository throw error', () => {
        const error = new Error('not created');
        userAchievementRepository.findByUsername.mockImplementation(() => Promise.reject(error));
        expect(userAchievementService.findByUsername(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await userAchievementService.findByUsername(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});