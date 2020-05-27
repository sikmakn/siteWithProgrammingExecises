module.exports = {
    setToken: (res, token) => {
        res.cookie('Authorization', `Bearer ${token}`, {httpOnly: true, sameSite: true});
    },
    setFingerprint: (res, fingerprint) => {
        res.cookie('fingerprint', fingerprint, {httpOnly: true, sameSite: true});
    }
};