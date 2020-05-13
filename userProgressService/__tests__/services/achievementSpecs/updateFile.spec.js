const achievementRepository = require('../../../db/repositories/achievementRepository');
jest.mock('../../../db/repositories/achievementRepository');
const achievementService = require('../../../services/achievementService');

module.exports = describe('updateFile function', () => {
    let msg;

    beforeEach(() => {
        msg = {id: 'id', conditions: [], description: 'descriptions', name: 'name'};
        achievementRepository.updateFile.mockReturnValue({});
    });

    test('achievementRepository.updateFile should be called', async () => {
        await achievementService.updateFile(msg);
        expect(achievementRepository.updateFile).toBeCalled();
    });

    test('achievementRepository throw error', () => {
        const error = new Error('not updated');
        achievementRepository.updateFile.mockImplementation(() => Promise.reject(error));
        expect(achievementService.updateFile(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await achievementService.updateFile(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

    test('must return right', async () => {
        const result = {result: 'result'};
        achievementRepository.updateFile.mockReturnValue(result);
        expect(await achievementService.updateFile(msg)).toEqual(result);
    });

});