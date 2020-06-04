const userService = require('../services/userService');
const {userSchema, statusSchema, passwordSchema, emailSchema} = require('../validationSchemas/userSchema');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');

module.exports = {
    name: 'user',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const userData = await userSchema.validateAsync(msg);
                    if (await userService.findByIdentityData({username: userData.username, email: userData.email})) {
                        res({error: 'user exist'});
                        return;
                    }
                    await userService.create(userData);
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'isValidNonBlocked',
            method: async (msg, res) => {
                try {
                    const result = await userService.isValidNonBLocked(msg);
                    res({result});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'updatePassword',
            method: async (msg, res) => {
                try {
                    const password = await passwordSchema.validateAsync(msg.password);
                    await userService.updatePassword({username: msg.username, password});
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'updatePersonalInfo',
            method: async (msg, res) => {
                try {
                    let {username, password, email, oldPassword} = msg;
                    if (email) email = await emailSchema.validateAsync(email);
                    if (password) {
                        password = await passwordSchema.validateAsync(password);
                        oldPassword = await passwordSchema.validateAsync(oldPassword)
                    }
                    if (await userService.updatePersonalInfo({username, oldPassword, password, email})) {
                        res({result: true});
                        return;
                    }
                    res({error: new Error('oldPassword is not valid')});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'getPersonalInfo',
            method: async (msg, res) => {
                try {
                    const {email} = await userService.findByUsername(msg.username);
                    res({result: {email}});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'updateStatus',
            method: async (msg, res) => {
                try {
                    const status = await statusSchema.validateAsync(msg.status);
                    await userService.updateStatus({
                        username: msg.username,
                        status
                    });
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error, date: Date.now(), serviceName});
                    res({error});
                }
            }
        },
        {
            name: 'updateBlock',
            method: async (msg, res) => {
                try {
                    await userService.updateBlocking(msg);
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