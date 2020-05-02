const exerciseService = require('../services/exerciseService');
const exerciseMapper = require('../Mappers/exerciseMapper');

module.exports = {
    name: 'exercise',
    methods: [
        {
            name: 'testById',
            method: async (msg, res) => {
                const {id, sourceCode} = msg;
                console.log(msg);
                const results = await exerciseService.makeTests(id, sourceCode);
                res(results);
            }
        },
        {
            name: 'getByThemeId',
            method: async (msg, res) => {
                const {themeId, difficulty} = msg;
                const exercises = await exerciseService.findByThemeId(themeId, difficulty);
                const mappedExercises = exercises.map(ex => exerciseMapper.fromExerciseToOutObj(ex));
                res(mappedExercises);
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
            name: 'update',
            method: async (msg, res) => {
                const {id, exercise} = msg;
                const exerciseObj = exerciseMapper.fromObjToExerciseObj(exercise);
                const resultExercise = await exerciseService.findByIdAndUpdate(id, exerciseObj);
                res(resultExercise);
            }
        },
    ]
};