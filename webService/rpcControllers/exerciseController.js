const exerciseService = require('../services/exerciseService');
const exerciseMapper = require('../Mappers/exerciseMapper');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');
const {Types} = require('mongoose');

module.exports = {
    name: 'exercise',
    methods: [
        {
            name: 'testById',
            method: async (msg, res) => {
                try {
                    const {id, sourceCode} = msg;
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    const exercise = await exerciseService.findById(id);
                    if (!exercise) return res({error: new Error('not found exercise by this id')});
                    const testResults = await exerciseService.makeTests(exercise.tests, exercise.language, sourceCode);
                    res({result: testResults});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getByThemeId',
            method: async (msg, res) => {
                try {
                    const {themeId, difficulty} = msg;
                    const exercises = await exerciseService.findByThemeId(themeId, difficulty);
                    res({result: exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex))});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    let newExercise = exerciseMapper.fromObjToExerciseObj(msg);
                    res({result: await exerciseService.create(newExercise)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'updateById',
            method: async (msg, res) => {
                try {
                    const {id, exercise} = msg;
                    const exerciseObj = exerciseMapper.fromObjToExerciseObj(exercise);
                    res({result: await exerciseService.findByIdAndUpdate(id, exerciseObj)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};