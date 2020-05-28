const express = require("express");
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const progressServiceRPC = rpcQueues[rpcServices.PROGRESS_SERVICE.serviceName];
const progressControllers = rpcServices.PROGRESS_SERVICE.controllers;
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const stream = require('stream');

const router = express.Router();

router.post('/', upload.single('achievementImg'), asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const achievement = await progressServiceRPC[progressControllers.achievement](channel, 'create', {
        conditions: JSON.parse(req.body.conditions),
        file: req.file,
        description: req.body.description,
        name: req.body.name,
    });
    res.json(achievement);
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const achievement = await progressServiceRPC[progressControllers.achievement](channel, 'updateAchievementFile', {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        conditions: JSON.parse(req.body.conditions),
    });
    res.json(achievement);
}));

router.get('/file/:id', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const file = await progressServiceRPC[progressControllers.achievement](channel, 'getAchievementFile', {id: req.params.id});
    res.set('Content-Type', file.contentType);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(file.buffer));
    bufferStream.pipe(res);
}));

router.put('/file/:id', upload.single('achievementIng'), asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const achievementFile = await progressServiceRPC[progressControllers.achievement](channel, 'updateAchievementFile', {
        conditions: JSON.parse(req.body.conditions),
        file: req.file,
        fileId: req.params.id,
    });
    res.json(achievementFile);
}));

module.exports = router;