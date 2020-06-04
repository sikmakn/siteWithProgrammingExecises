const authService = require('../services/authService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'auth',
    methods: [
        {
            name: 'login',
            method: async (msg, res) => {
                try {
                    let {userId, fingerPrint, role} = msg;
                    if (await authService.isTooManyAuth(userId)) {
                        await authService.blockUser(userId);
                        return res({error: new Error('too many concurrent auth by user')});
                    }
                    res({result: await authService.createToken({userId, fingerPrint, role})});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'updateToken',
            method: async (msg, res) => {
                try {
                    let {token, fingerPrint} = msg;
                    if (!await authService.isValidToken({token, fingerPrint}))
                        return res({error: new Error('not valid token')});
                    const newToken = await authService.updateToken(token);
                    res({result: newToken});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'logoutByToken',
            method: async (msg, res) => {
                try {
                    let {token} = msg;
                    const result = await authService.logOutByToken(token);
                    res({result});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'logOutEverywhere',
            method: async (msg, res) => {
                try {
                    let {userId} = msg;
                    await authService.logOutUser(userId);
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