const emailService = require('../services/emailService');

module.exports = {
    name: 'email',
    methods: [
        {
            name: 'sendVerify',
            method: async (msg, res) => {
                try {
                    await emailService.sendVerifyMail(msg);
                    res({result: true});
                } catch (e) {
                    console.log(e);//todo logs
                    res({error: e});
                }
            }
        },
    ]
};