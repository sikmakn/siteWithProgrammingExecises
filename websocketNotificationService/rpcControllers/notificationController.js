const newUserAchievementsService = require('../services/newUserAchievementsService');
const {pubExchanges, serviceName} = require('../options');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'achievement',
    methods: [
        {
            name: 'getNewUserAchievementsIdsByUserId',
            method: async (msg, res) => {
                try {
                    res({result: await newUserAchievementsService.getIdsByUserId(msg)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'readByUserId',
            method: async (msg, res) => {
                try {
                    res({result: await newUserAchievementsService.readNotificationsByUserId(msg)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};