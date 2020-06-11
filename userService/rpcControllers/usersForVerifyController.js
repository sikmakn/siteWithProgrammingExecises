const userService = require('../services/userService');
const usersForVerifyService = require('../services/usersForVerifyService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');
const {Types} = require('mongoose');

module.exports = {
    name: 'usersForVerify',
    methods: [
        {
            name: 'verify',
            method: async ({id}, res) => {
                try {
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('not valid Id'))});
                    const userForVerify = await usersForVerifyService.remove({id});
                    if (!userForVerify)
                        return res({error: serializeError(new Error('user not exist'))});
                    const result = await userService.updateBlocking({
                        username: userForVerify.username,
                        isBlocked: false,
                    });
                    res({result});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'delete',
            method: async ({id}, res) => {
                try {
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('not valid Id'))});
                    const userForVerify = await usersForVerifyService.remove({id});
                    if (!userForVerify) return res({result: true});
                    const result = await userService.removeUser({username: userForVerify.username});
                    res({result});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};