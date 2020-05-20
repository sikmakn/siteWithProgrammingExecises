const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');
const achievementController = require('../../../controllers/achievementController');

describe('getManyAchievements function', () => {
    let getManyAchievements;
    let msg;
    let fn;

    beforeAll(() => {
        getManyAchievements = achievementController.methods.find(m => m.name === 'getManyAchievements').method;
    });

    beforeEach(() => {
        msg = {achievementFotFind: {_id: '_id'}, count: 10, sort: {number: 1}, skip: 0};
        fn = jest.fn(d => d);
        achievementService.findMany.mockReturnValue([]);
    });

    test('res should be called', async () => {
        await getManyAchievements(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await getManyAchievements(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error();
        achievementService.findMany.mockImplementation(() => Promise.reject(error));
        await getManyAchievements(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('must return right fields', async () => {
        const result = [{
            _id: 'id',
            name: 'name',
            fileId: 'fileId',
            description: 'description',
            uselessField: 'uselessField',
        }];
        achievementService.findMany.mockReturnValue(result);
        await getManyAchievements(msg, fn);
        expect(fn.mock.results[0].value).toEqual([{
            _id: 'id',
            name: 'name',
            fileId: 'fileId',
            description: 'description',
        }]);
    });

});