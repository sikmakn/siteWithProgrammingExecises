const crypto = require('crypto');
module.exports = {
    getRandomString: () => crypto.randomBytes(128).toString('base64'),
};