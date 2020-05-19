const exerciseResultRepository = require('../../../db/repositories/exerciseResultRepository');
jest.mock('../../../db/repositories/exerciseResultRepository');
const exerciseResultService = require('../../../services/exerciseResultService');

describe('findByUsername function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = 'username';
        achievementFindResult = [{_doc: "doc"}];
        exerciseResultRepository.find.mockReturnValue(achievementFindResult);
    });

    test('achievementRepository.find should be called', async () => {
        await exerciseResultService.findByUsername(msg);
        expect(exerciseResultRepository.find).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        exerciseResultRepository.find.mockImplementation(() => Promise.reject(error));
        expect(exerciseResultService.findByUsername(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await exerciseResultService.findByUsername(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});