const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');

require('../../../services/userAchievementService');
jest.mock('../../../services/userAchievementService');

const achievementController = require('../../../rpcControllers/achievementController');

describe('updateAchievementById function', () => {
    let updateAchievementById;
    let msg;
    let fn;

    beforeAll(() => {
        updateAchievementById = achievementController.methods.find(m => m.name === 'updateAchievementById').method;
    });

    beforeEach(() => {
        msg = {
            id: 'id',
            description: 'description',
            name: 'name',
            conditions: [{
                themeId: 'themeId',
                exerciseId: 'exerciseId',
                result: 'correct',
                difficulty: 'easy',
                count: 10,
            }],
        };
        fn = jest.fn(d => d);
        achievementService.updateById.mockReturnValue([]);
    });

    test('res should be called', async () => {
        await updateAchievementById(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await updateAchievementById(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error();
        achievementService.updateById.mockImplementation(() => Promise.reject(error));
        await updateAchievementById(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('must return right fields', async () => {
        achievementService.updateById.mockReturnValue(msg);
        await updateAchievementById(msg, fn);
        expect(fn.mock.results[0].value).toEqual(msg);
    });

});