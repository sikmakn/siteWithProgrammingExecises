const exerciseResultRepository = require('../../../db/repositories/exerciseResultRepository');
jest.mock('../../../db/repositories/exerciseResultRepository');
const exerciseResultService = require('../../../services/exerciseResultService');

describe('groupByUsername function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {exerciseId: 'exerciseId'};
        achievementFindResult = [{_doc: "doc"}];
        exerciseResultRepository.aggregate.mockReturnValue(achievementFindResult);
    });

    test('achievementRepository.groupByUsername should be called', async () => {
        await exerciseResultService.aggregate(msg);
        expect(exerciseResultRepository.aggregate).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        exerciseResultRepository.aggregate.mockImplementation(() => Promise.reject(error));
        expect(exerciseResultService.aggregate(msg)).rejects.toThrowError();
    });

    test('return Truthy', async () => {
        const result = await exerciseResultService.aggregate(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});