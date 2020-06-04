const logic = require('../logic');
const {serviceName} = require('../options');

module.exports = {
    name: 'log',
    methods: [
        {
            name: 'get',
            method: async (msg, res) => {
                try {
                    res({result: await logic.get(msg)});
                } catch (error) {
                    await logic.create({message: error, serviceName, timeStamp: Date.now()});
                    res({error});
                }
            }
        },
    ]
};