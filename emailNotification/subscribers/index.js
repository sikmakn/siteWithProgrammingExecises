const emailService = require('../services/emailService');
module.exports = [
    {
        subExchange: 'blockUser',
        method: async (content) => {
            try {
                if (content.isBlocked) {
                    await emailService.sendBlockMail(content);
                } else {
                    await emailService.sendUnblockMail(content);
                }
            } catch (e) {
                console.log('subController');
                console.log(e);  //todo add logs
            }
        },
    },
];
