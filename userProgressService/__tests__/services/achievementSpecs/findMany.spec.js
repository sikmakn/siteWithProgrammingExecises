const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const achievementService = require('../../../services/achievementService');

module.exports = describe('findMany function', () => {
    let msg;
    let achievementFindResult;

    beforeEach(() => {
        msg = {achievementFotFind: {}, count: 10, sort: {number: 1}, skip: 10};
        achievementFindResult = [{_doc: "doc"}];
        achievementRepository.findMany.mockReturnValue(achievementFindResult);
    });

    test('achievementRepository.findMany should be called', async () => {
        await achievementService.findMany(msg);
        expect(achievementRepository.findMany).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        achievementRepository.findMany.mockImplementation(() => Promise.reject(error));
        expect(achievementService.findMany(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await achievementService.findMany(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});