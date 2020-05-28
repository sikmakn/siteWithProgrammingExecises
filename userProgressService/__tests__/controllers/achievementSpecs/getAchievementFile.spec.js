const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');
const achievementController = require('../../../rpcControllers/achievementController');

describe('getAchievementFile function', () => {
    let getAchievementFile;
    let msg;
    let fn;
    let result;

    beforeAll(() => {
        getAchievementFile = achievementController.methods.find(m => m.name === 'getAchievementFile').method;
    });

    beforeEach(() => {
        result = {};
        msg = {_id: 'id'};
        fn = jest.fn(d => d);
        achievementService.findFile.mockReturnValue(result);
    });

    test('res should be called', async () => {
        await getAchievementFile(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await getAchievementFile(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error();
        achievementService.findFile.mockImplementation(() => Promise.reject(error));
        await getAchievementFile(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('should return right fields', async () => {
        const {_id, name, fileName, description} = result;
        await getAchievementFile(msg, fn);
        expect(fn.mock.results[0].value).toEqual({_id, name, fileName, description});
    });
});