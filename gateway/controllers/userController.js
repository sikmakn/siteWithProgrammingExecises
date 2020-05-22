const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues} = require('../amqpHandler');
const progressServiceRPC = rpcQueues[rpcServices.USER_SERVICE.serviceName];
const progressControllers = rpcServices.USER_SERVICE.controllers;

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
    const result = await progressServiceRPC[progressControllers.user]('create', {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    if (result.result) {//todo redirect to user page
        res.status(200).send();
    } else {//todo redirect to auth page with error message
        res.status(401).send();
    }
}));

router.put('/password', asyncHandler(async (req, res) => {
    const result = await progressServiceRPC[progressControllers.user]('updatePassword', {
        username: req.body.username,
        password: req.body.password,
    });
    if (result.result) {//todo redirect to user page
        res.status(200).send();
    } else {//todo redirect to user page with error message
        res.status(401).send();
    }
}));

router.get('/updatePersonalInfo', asyncHandler(async (req, res) => {
    const result = await progressServiceRPC[progressControllers.user]('updatePersonalInfo', {
        username: req.body.username,
        email: req.body.email,
    });
    res.send(result);
}));

module.exports = router;