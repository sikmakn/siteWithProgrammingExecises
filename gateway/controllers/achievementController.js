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

router.get('/:id', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await progressServiceRPC[progressControllers.achievement](channel, 'getAchievement', {id: req.params.id});
    res.json(answer.result);
}));

router.post('/', upload.fields([{name: 'achievementImg'}, {name: 'previewImg'}]), asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await progressServiceRPC[progressControllers.achievement](channel, 'create', {
        conditions: JSON.parse(req.body.conditions),
        file: req.files.achievementImg[0],
        description: req.body.description,
        name: req.body.name,
        previewFile: req.files.previewImg[0],
    });
    res.json(answer.result);
}));

router.put('/:id', asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const answer = await progressServiceRPC[progressControllers.achievement](channel, 'updateAchievementFile', {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        conditions: JSON.parse(req.body.conditions),
    });
    res.json(answer.result);
}));

router.get('/file/:id', asyncHandler(async (req, res, next) => {
    const channel = await getChannel();
    const {result: file} = await progressServiceRPC[progressControllers.achievement](channel, 'getAchievementFile', {id: req.params.id});
    if (!file.buffer) {
        next();
        return;
    }
    res.set('Content-Type', file.contentType);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(file.buffer));
    bufferStream.pipe(res);
}));

router.put('/file/:id', upload.single('achievementIng'), asyncHandler(async (req, res) => {
    const channel = await getChannel();
    const {result: file} = await progressServiceRPC[progressControllers.achievement](channel, 'updateAchievementFile', {
        conditions: JSON.parse(req.body.conditions),
        file: req.file,
        fileId: req.params.id,
    });
    res.json(file);
}));

module.exports = router;