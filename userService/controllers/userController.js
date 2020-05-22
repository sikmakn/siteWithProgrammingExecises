const userService = require('../services/userService');
const {userSchema, statusSchema, passwordSchema, emailSchema} = require('../validationSchemas/userSchema');

module.exports = {
    name: 'user',
    methods: [
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const {error, value: userData} = await userSchema.validateAsync(msg);
                    if (error) {
                        res(error);
                        return;
                    }
                    if (await userService.findByUsername(userData.username)) {
                        res({error: 'user exist'});
                        return;
                    }
                    await userService.create(userData);
                    res(true);
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'validate',
            method: async (msg, res) => {
                try {
                    res(await userService.validate(msg));
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'updatePassword',
            method: async (msg, res) => {
                try {
                    const {error, value} = await passwordSchema.validateAsync(msg.password);
                    if (error) {
                        res(error);
                        return;
                    }
                    await userService.updatePassword({username: msg.username, password: value});
                    res(true);
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'updatePersonalInfo',
            method: async (msg, res) => {
                try {
                    const {error, value} = await emailSchema.validateAsync(msg.email);
                    if (error) {
                        res(error);
                        return;
                    }
                    await userService.updateEmail({username: msg.username, email: value});
                    res(true);
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'getPersonalInfo',
            method: async (msg, res) => {
                try {
                    const {email} = await userService.findByUsername(msg.username);
                    res({email});
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'updateStatus',
            method: async (msg, res) => {
                try {
                    const {error, value: newStatus} = await statusSchema.validateAsync(msg.status);
                    if (error) {
                        res(error);
                        return;
                    }
                    await userService.updateStatus({
                        username: msg.username,
                        status: newStatus
                    });
                    res(true);
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
        {
            name: 'updateBlock',
            method: async (msg, res) => {
                try {
                    await userService.updateBlocking(msg);
                    res(true);
                } catch (e) {
                    //todo logs
                    res(e);
                }
            }
        },
    ]
};