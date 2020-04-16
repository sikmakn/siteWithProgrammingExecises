module.exports = function mustAuthenticated(req, res, next) {
    if (req.header('Authorization') !== 'Bearer $2y$18$QRWjt0gx8s/VL3eZL/A3IuslIrn8RRsU6VeAw86.LYML6Ylp7SLQ.') {
        return res.status(401).send({error: "UNAUTHORIZED"});
    }
    next();
};
