const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const userAchievementService = require('../../../services/userAchievementService');
jest.mock('../../../services/userAchievementService');
const achievementService = require('../../../services/achievementService');

module.exports = describe('updateById function', () => {
    let msg;
    let updateAchievementResult;

    beforeEach(() => {
        msg = {id: 'id', conditions: [], description: 'descriptions', name: 'name'};
        updateAchievementResult = {_doc: "doc"};
        achievementRepository.updateAchievement.mockReturnValue(updateAchievementResult);
        userAchievementService.addByConditions.mockReturnValue({});
    });

    test('achievementRepository.updateById should be called', async () => {
        await achievementService.updateById(msg);
        expect(achievementRepository.updateAchievement).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not updated');
        achievementRepository.updateAchievement.mockImplementation(() => Promise.reject(error));
        expect(achievementService.updateById(msg)).rejects.toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not updated');
        userAchievementService.addByConditions.mockImplementation(() => Promise.reject(error));
        expect(achievementService.updateById(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await achievementService.updateById(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

    test('must return right', async () => {
        const result = {result: 'result'};
        achievementRepository.updateAchievement.mockReturnValue({_doc: result});
        expect(await achievementService.updateById(msg)).toEqual(result);
    });

});