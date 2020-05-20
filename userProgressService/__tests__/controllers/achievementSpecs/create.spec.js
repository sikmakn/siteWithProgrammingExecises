const achievementService = require('../../../services/achievementService');
jest.mock('../../../services/achievementService');
const achievementController = require('../../../controllers/achievementController');

describe('create function', () => {
    let msg;
    let createMethod;
    let fn;
    beforeAll(() => {
        createMethod = achievementController.methods.find(m => m.name === 'create').method;
    });

    beforeEach(() => {
        msg = {};
        fn = jest.fn(d => d);
        achievementService.create.mockReturnValue({});
    });

    test('res should be called', async () => {
        await createMethod(msg, fn);
        expect(fn).toBeCalled();
    });
    test('res should be called once', async () => {
        await createMethod(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error('not created');
        achievementService.create.mockImplementation(() => Promise.reject(error));
        await createMethod(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });
});