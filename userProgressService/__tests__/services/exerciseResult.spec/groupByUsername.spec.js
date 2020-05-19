const exerciseResultRepository = require('../../../db/repositories/exerciseResultRepository');
jest.mock('../../../db/repositories/exerciseResultRepository');
const exerciseResultService = require('../../../services/exerciseResultService');

module.exports = describe('groupByUsername function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {exerciseId: 'exerciseId'};
        achievementFindResult = [{_doc: "doc"}];
        exerciseResultRepository.groupByUsername.mockReturnValue(achievementFindResult);
    });

    test('achievementRepository.groupByUsername should be called', async () => {
        await exerciseResultService.groupByUsername(msg);
        expect(exerciseResultRepository.groupByUsername).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        exerciseResultRepository.groupByUsername.mockImplementation(() => Promise.reject(error));
        expect(exerciseResultService.groupByUsername(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await exerciseResultService.groupByUsername(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});