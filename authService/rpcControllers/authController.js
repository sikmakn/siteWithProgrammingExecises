const authService = require('../services/authService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = {
    name: 'auth',
    methods: [
        {
            name: 'login',
            method: async (msg, res) => {
                try {
                    let {userId, fingerPrint} = msg;
                    if (await authService.isTooManyAuth(userId)) {
                        await authService.blockUser(userId);
                        return res({error: new Error('too many concurrent auth by user')});
                    }
                    const token = await authService.createToken({userId, fingerPrint});
                    res({result: token});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
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
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
    ]
};