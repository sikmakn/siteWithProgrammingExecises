const userService = require('../services/userService');
const {userSchema, roleSchema, passwordSchema, emailSchema} = require('../validationSchemas/userSchema');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'user',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const userData = await userSchema.validateAsync(msg);
                    if (await userService.findByIdentityData({username: userData.username, email: userData.email}))
                        return res({error: serializeError(new Error('user exist'))});
                    await userService.create(userData);
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getRole',
            method: async ({username}, res) => {
                try {
                    const {role} = await userService.findByUsername(username);
                    res({result: role});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                    if (await userService.updatePersonalInfo({username, oldPassword, password, email}))
                        return res({result: true});
                    res({error: serializeError(new Error('oldPassword is not valid'))});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'updateRole',
            method: async (msg, res) => {
                try {
                    const role = await roleSchema.validateAsync(msg.role);
                    await userService.updateRole({username: msg.username, role});
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'update',
            method: async ({username, role, isBlocked, email}, res) => {
                try {
                    if (email) await emailSchema.validateAsync(email);
                    if (role) await roleSchema.validateAsync(role);
                    await userService.update({username, role, isBlocked, email});
                    res({result: true});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'delete',
            method: async ({username}, res) => {
                try {
                    res({result: await userService.removeUser({username})});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};