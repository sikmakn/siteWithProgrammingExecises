const {ADMIN_BEARER} = require('../config');

module.exports = function mustAuthenticated(req, res, next) {
    if (req.header('Authorization') !== `Bearer ${ADMIN_BEARER}`) {
        return res.status(401).send({error: "UNAUTHORIZED"});
    }
    next();
};
