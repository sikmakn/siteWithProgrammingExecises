const express = require('express');
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const logServiceRPC = rpcQueues[rpcServices.LOG_SERVICE.serviceName];
const logServController = rpcServices.LOG_SERVICE.controllers.log;
const {adminValidate} = require('../helpers/auth');

const router = express.Router();

router.get('/', adminValidate, asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {serviceName, from, to} = req.query;
    const answer = await logServiceRPC[logServController](channel, 'get', {serviceName, from, to});
    if (answer.error) res.status(500);
    res.json(answer);
}));

module.exports = router;