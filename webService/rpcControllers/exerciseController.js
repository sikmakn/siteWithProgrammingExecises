const exerciseService = require('../services/exerciseService');
const exerciseMapper = require('../Mappers/exerciseMapper');

module.exports = {
    name: 'exercise',
    methods: [
        {
            name: 'testById',
            method: async (msg, res) => {
                const {id, sourceCode} = msg;
                const results = await exerciseService.makeTests(id, sourceCode);
                res(results);
            }
        },
        {
            name: 'getByThemeId',
            method: async (msg, res) => {
                try {
                    const {themeId, difficulty} = msg;
                    const exercises = await exerciseService.findByThemeId(themeId, difficulty);
                    const mappedExercises = exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex));
                    res(mappedExercises);
                }catch (e) {
                    res(null)
                }
            }
        },
        {
            name: 'create',
            method: async (msg, res) => {
                let newExercise = exerciseMapper.fromObjToExerciseObj(msg);
                const result = await exerciseService.create(newExercise);
                res(result);
            }
        },
        {
            name: 'updateById',
            method: async (msg, res) => {
                const {id, exercise} = msg;
                const exerciseObj = exerciseMapper.fromObjToExerciseObj(exercise);
                const resultExercise = await exerciseService.findByIdAndUpdate(id, exerciseObj);
                res(resultExercise);
            }
        },
    ]
};