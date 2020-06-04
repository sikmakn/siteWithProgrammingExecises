const logic = require('../logic');

module.exports = [
    {
        subExchange: 'error',
        method: async ({error, serviceName, date}) => {
            try {
                console.log(serviceName);
                console.log(date);
                console.log(error);
                await logic.create({message: error, serviceName, timeStamp: date});
            } catch (error) {
                console.log(error);
            }
        },
    },
];