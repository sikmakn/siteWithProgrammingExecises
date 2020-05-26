module.exports = function (res, token) {
    res.cookie('Authorization', `Bearer ${token}`, {httpOnly: true, sameSite: true});
};