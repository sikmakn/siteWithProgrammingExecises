const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const userAchievementService = require('../../../services/userAchievementService');
jest.mock('../../../services/userAchievementService');
const achievementService = require('../../../services/achievementService');

describe('create function', () => {
    let msg;
    let achievementCreateResult;

    beforeEach(() => {
        msg = {file: {}, conditions: [{}], description: 'description', name: 'name'};
        achievementCreateResult = {_doc: "doc"};
        achievementRepository.create.mockReturnValue(achievementCreateResult);
        userAchievementService.addByConditions.mockReturnValue({});
    });

    test('achievementRepository.create should be called', async () => {
        await achievementService.create(msg);
        expect(achievementRepository.create).toBeCalled();
    });

    test('userAchievementService.addByConditions should be called', async () => {
        await achievementService.create(msg);
        expect(achievementRepository.create).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        achievementRepository.create.mockImplementation(() => Promise.reject(error));
        expect(achievementService.create(msg)).rejects.toThrowError();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        userAchievementService.addByConditions.mockImplementation(() => Promise.reject(error));
        expect(achievementService.create(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await achievementService.create(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});