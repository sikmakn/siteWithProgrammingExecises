const emailService = require('../services/emailService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'email',
    methods: [
        {
            name: 'sendVerify',
            method: async (msg, res) => {
                try {
                    await emailService.sendVerifyMail(msg);
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};