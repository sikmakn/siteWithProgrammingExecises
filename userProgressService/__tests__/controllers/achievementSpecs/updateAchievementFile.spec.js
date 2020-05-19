const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');
const achievementController = require('../../../controllers/achievementController');

module.exports = describe('updateAchievementFile function', () => {
    let updateAchievementFile;
    let msg;
    let fn;

    beforeAll(() => {
        updateAchievementFile = achievementController.methods.find(m => m.name === 'updateAchievementFile').method;
    });

    beforeEach(() => {
        msg = {};
        fn = jest.fn(d => d);
        achievementService.updateFile.mockReturnValue([]);
    });

    test('res should be called', async () => {
        await updateAchievementFile(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await updateAchievementFile(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error();
        achievementService.updateFile.mockImplementation(() => Promise.reject(error));
        await updateAchievementFile(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('must return right fields', async () => {
        const result = {result: 'result'};
        achievementService.updateFile.mockReturnValue(result);
        await updateAchievementFile(msg, fn);
        expect(fn.mock.results[0].value).toEqual(result);
    });

});