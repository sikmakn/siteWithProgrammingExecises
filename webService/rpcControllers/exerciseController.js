const exerciseService = require('../services/exerciseService');
const exerciseMapper = require('../Mappers/exerciseMapper');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = {
    name: 'exercise',
    methods: [
        {
            name: 'testById',
            method: async (msg, res) => {
                try {
                    const {id, sourceCode} = msg;
                    res({result: await exerciseService.makeTests(id, sourceCode)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
    ]
};