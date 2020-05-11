const resultService = require('../services/exerciseResultService');

module.exports = {
    name: 'exerciseResult',
    methods: [
        {
            name: 'getByUsernameAndThemeId',
            method: async (msg, res) => {
                const results = await resultService.findByThemeId(msg);
                res(results);
            }
        },
        {
            name: 'getByUsernameAndExerciseId',
            method: async (msg, res) => {
                const result = await resultService.findByExerciseId(msg);
                res(result);
            }
        },
    ]
};