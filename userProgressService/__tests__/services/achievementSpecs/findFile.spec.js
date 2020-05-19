const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const achievementService = require('../../../services/achievementService');

module.exports = describe('findFile function', () => {
    let msg;
    let achievementCreateResult;

    beforeEach(() => {
        msg = 'fileId';
        achievementCreateResult = {_doc: "doc"};
        achievementRepository.findFile.mockReturnValue(achievementCreateResult);
    });

    test('achievementRepository.findFile should be called', async () => {
        await achievementService.findFile(msg);
        expect(achievementRepository.findFile).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not created');
        achievementRepository.findFile.mockImplementation(() => Promise.reject(error));
        expect(achievementService.findFile(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await achievementService.findFile(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

});