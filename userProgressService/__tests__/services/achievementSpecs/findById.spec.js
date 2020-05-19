const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const achievementService = require('../../../services/achievementService');

describe('findById function', () => {
    let msg;
    let achievementCreateResult;

    beforeEach(() => {
        msg = 'id';
        achievementCreateResult = {_doc: "doc"};
        achievementRepository.findById.mockReturnValue(achievementCreateResult);
    });

    test('achievementRepository.findById should be called', async () => {
        await achievementService.findById(msg);
        expect(achievementRepository.findById).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        achievementRepository.findById.mockImplementation(() => Promise.reject(error));
        expect(achievementService.findById(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await achievementService.findById(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});