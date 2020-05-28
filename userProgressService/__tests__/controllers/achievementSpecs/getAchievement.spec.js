const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');
const achievementController = require('../../../rpcControllers/achievementController');

describe('getAchievement function', () => {
    let getAchievement;
    let msg;
    let fn;
    let result;

    beforeAll(() => {
        getAchievement = achievementController.methods.find(m => m.name === 'getAchievement').method;
    });

    beforeEach(() => {
        result = {
            _id: 'id',
            name: 'name',
            fileId: 'fileId',
            description: 'description',
            _v: 'uselessField',
        };
        msg = {_id: 'id'};
        fn = jest.fn(d => d);
        achievementService.findById.mockReturnValue(result);
    });

    test('res should be called', async () => {
        await getAchievement(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await getAchievement(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error();
        achievementService.findById.mockImplementation(() => Promise.reject(error));
        await getAchievement(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('should return right fields', async () => {
        const {_id, name, description, fileId} = result;
        await getAchievement(msg, fn);
        expect(fn.mock.results[0].value).toEqual({_id, name, description, fileId});
    });

});