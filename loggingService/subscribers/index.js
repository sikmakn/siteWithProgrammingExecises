const logic = require('../logic');
const {pubExchanges, serviceName: thisServiceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = [
    {
        subExchange: 'error',
        method: async ({error, serviceName, date}) => {
            try {
                await logic.create({message: error, serviceName, timeStamp: date});
            } catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error, date: Date.now(), serviceName: thisServiceName});
            }
        },
    },
];