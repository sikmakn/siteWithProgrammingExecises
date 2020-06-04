const logic = require('../logic');

module.exports = [
    {
        subExchange: 'error',
        method: async ({error, serviceName, date}) => {
            try {
                await logic.create({message: error, serviceName, timeStamp: date});
            } catch (error) {
                console.log(error);
            }
        },
    },
];