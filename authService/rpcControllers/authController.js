const authService = require('../services/authService');

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
                        throw new Error('too many concurrent auth by user');
                    }
                    const token = await authService.createToken({userId, fingerPrint});
                    res({result: token});
                } catch (e) {
                    //todo logs
                    console.error(e);
                    res({error: e});
                }
            }
        },
        {
            name: 'updateToken',
            method: async (msg, res) => {
                try {
                    let {token, fingerPrint} = msg;
                    if (!await authService.isValidToken({token, fingerPrint})) throw new Error('not valid token');
                    const newToken = await authService.updateToken(token);
                    res({result: newToken});
                } catch (e) {
                    //todo logs
                    console.error(e);
                    res({error: e});
                }
            }
        },
        {
            name: 'logout',
            method: async (msg, res) => {
                try {
                    let {userId, fingerPrint} = msg;
                    await authService.deleteOneAuthData({userId, fingerPrint});
                    res({result: true});
                } catch (e) {
                    //todo logs
                    console.error(e);
                    res({error: e});
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
                } catch (e) {
                    //todo logs
                    console.error(e);
                    res({error: e});
                }
            }
        },
    ]
};