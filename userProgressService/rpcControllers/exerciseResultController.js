const resultService = require('../services/exerciseResultService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = {
    name: 'exerciseResult',
    methods: [
        {
            name: 'get',
            method: async (msg, res) => {
                try {
                    const findingResults = await resultService.find(msg);
                    const results = findingResults.map(r => {
                        const fullResult = {
                            themeId: r.themeId,
                            exerciseId: r.exerciseId,
                            difficulty: r.difficulty,
                            username: r.username,
                            sourceCode: r.sourceCode,
                            result: r.result,
                            _id: r._id,
                        };
                        const result = {};
                        Object.assign(result, fullResult);
                        return result;
                    });
                    res({result: results});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
    ]
};