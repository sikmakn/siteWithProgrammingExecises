const exerciseResultRepository = require('../../../db/repositories/exerciseResultRepository');
jest.mock('../../../db/repositories/exerciseResultRepository');
const exerciseResultService = require('../../../services/exerciseResultService');

describe('findOneAndUpdate function', () => {
    let msg;

    beforeEach(() => {
        msg = {findParams: {}, updatedExercise: {}, results: []};
        exerciseResultRepository.findOneAndUpdate.mockImplementation((d) =>
            new Promise(res => res({_doc: d})));
    });

    test('exerciseResultRepository.findOneAndUpdate should be called', async () => {
        await exerciseResultService.findOneAndUpdate(msg);
        expect(exerciseResultRepository.findOneAndUpdate).toBeCalled();
    });

    test('exerciseResultRepository throw error', () => {
        const error = new Error('not created');
        exerciseResultRepository.findOneAndUpdate.mockImplementation(() => Promise.reject(error));
        expect(exerciseResultService.findOneAndUpdate(msg)).rejects.toBeCalled();
    });

    test('return Truthy', async () => {
        const result = await exerciseResultService.findOneAndUpdate(msg);
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).not.toBeNull();
        expect(result).not.toBeUndefined();
    });

    test('find common error result from results array', async () => {
        msg.results = [{resultName: 'correct'}, {resultName: 'incorrect'}, {resultName: 'error'}];

        exerciseResultRepository.findOneAndUpdate.mockImplementation(({updatedExercise}) =>
            ({_doc: updatedExercise.result}));

        expect(await exerciseResultService.findOneAndUpdate(msg)).toEqual('error');
    });

    test('find common incorrect result from results array', async () => {
        msg.results = [{resultName: 'correct'}, {resultName: 'incorrect'}, {resultName: 'correct'}];

        exerciseResultRepository.findOneAndUpdate.mockImplementation(({updatedExercise}) =>
            ({_doc: updatedExercise.result}));

        expect(await exerciseResultService.findOneAndUpdate(msg)).toEqual('incorrect');
    });

    test('find common correct result from results array', async () => {
        msg.results = [{resultName: 'correct'}, {resultName: 'correct'}, {resultName: 'correct'}];

        exerciseResultRepository.findOneAndUpdate.mockImplementation(({updatedExercise}) =>
            ({_doc: updatedExercise.result}));

        expect(await exerciseResultService.findOneAndUpdate(msg)).toEqual('correct');
    });

});