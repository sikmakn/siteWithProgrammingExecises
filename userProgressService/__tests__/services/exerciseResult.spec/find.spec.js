const exerciseResultRepository = require('../../../db/repositories/exerciseResultRepository');
jest.mock('../../../db/repositories/exerciseResultRepository');
const exerciseResultService = require('../../../services/exerciseResultService');

describe('find function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {exerciseId: 'exerciseId'};
        achievementFindResult = [{_doc: "doc"}];
        exerciseResultRepository.find.mockReturnValue(achievementFindResult);
    });

    test('achievementRepository.find should be called', async () => {
        await exerciseResultService.find(msg);
        expect(exerciseResultRepository.find).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        exerciseResultRepository.find.mockImplementation(() => Promise.reject(error));
        expect(exerciseResultService.find(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await exerciseResultService.find(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});