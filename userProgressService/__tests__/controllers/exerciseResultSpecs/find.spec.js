const exerciseResultService = require('../../../services/exerciseResultService');
jest.mock('../../../services/exerciseResultService');
const exerciseResultController = require('../../../controllers/exerciseResultController');

describe('find function', () => {
    let msg;
    let get;
    let fn;
    beforeAll(() => {
        get = exerciseResultController.methods
            .find(m => m.name === 'get').method;
    });

    beforeEach(() => {
        msg = {username: 'username', exerciseId: 'exerciseId', difficulty: 'difficulty'};
        fn = jest.fn(d => d);
        exerciseResultService.find.mockReturnValue({});
    });

    test('res should be called', async () => {
        await get(msg, fn);
        expect(fn).toBeCalled();
    });

    test('res should be called once', async () => {
        await get(msg, fn);
        expect(fn).toBeCalledTimes(1);
    });

    test('catch and return error', async () => {
        const error = new Error('not finding');
        exerciseResultService.find.mockImplementation(() => Promise.reject(error));
        await get(msg, fn);
        expect(fn.mock.results[0].value).toEqual(error);
    });

    test('must return right fields', async () => {
        const result = [{
            _id: 'id',
            themeId: 'themeId',
            exerciseId: 'exerciseId',
            difficulty: 'difficulty',
            sourceCode: 'sourceCode',
            result: 'result',
            _v: 'useless',
        }, {
            _id: 'id',
            themeId: 'themeId',
            exerciseId: 'exerciseId',
            difficulty: 'difficulty',
            sourceCode: 'sourceCode',
            result: 'result',
            _v: 'useless',
        }];
        exerciseResultService.find.mockReturnValue(result);

        await get(msg, fn);

        expect(fn.mock.results[0].value).toEqual([{
            _id: 'id',
            themeId: 'themeId',
            exerciseId: 'exerciseId',
            difficulty: 'difficulty',
            sourceCode: 'sourceCode',
            result: 'result',
        }, {
            _id: 'id',
            themeId: 'themeId',
            exerciseId: 'exerciseId',
            difficulty: 'difficulty',
            sourceCode: 'sourceCode',
            result: 'result',
        }]);
    });

    test('not return undefined properties', async () => {
        const result = [{
            _id: 'id',
            themeId: undefined,
            exerciseId: 'exerciseId',
            difficulty: undefined,
            sourceCode: 'sourceCode',
            result: undefined,
            _v: 'useless',
        }, {
            _id: 'id',
            themeId: 'themeId',
            exerciseId: undefined,
            difficulty: 'difficulty',
            sourceCode: undefined,
            result: 'result',
            _v: 'useless',
        }];
        exerciseResultService.find.mockReturnValue(result);

        await get(msg, fn);

        expect(fn.mock.results[0].value).toEqual([{
            _id: 'id',
            exerciseId: 'exerciseId',
            sourceCode: 'sourceCode',
        }, {
            _id: 'id',
            themeId: 'themeId',
            difficulty: 'difficulty',
            result: 'result',
        }]);
    });

    test('not return nonexistent properties', async () => {
        const result = [{
            _id: 'id',
            exerciseId: 'exerciseId',
            sourceCode: 'sourceCode',
            _v: 'useless',
        }, {
            _id: 'id',
            themeId: 'themeId',
            difficulty: 'difficulty',
            result: 'result',
            _v: 'useless',
        }];
        exerciseResultService.find.mockReturnValue(result);

        await get(msg, fn);

        expect(fn.mock.results[0].value).toEqual([{
            _id: 'id',
            exerciseId: 'exerciseId',
            sourceCode: 'sourceCode',
        }, {
            _id: 'id',
            themeId: 'themeId',
            difficulty: 'difficulty',
            result: 'result',
        }]);
    });

});