const cookieparser = require("cookieparser");
module.exports = {
    getToken: (cookie) => cookieparser.parse(cookie)?.Authorization.split(' ')[1],
};