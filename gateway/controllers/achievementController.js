const express = require('express');
const asyncHandler = require('express-async-handler');
const {rpcServices} = require('../options');
const {rpcQueues, getChannel} = require('../amqpHandler');
const progressServiceRPC = rpcQueues[rpcServices.PROGRESS_SERVICE.serviceName];
const websocketNotificationService = rpcQueues[rpcServices.WEBSOCKET_NOTIFICATION_SERVICE.serviceName];
const {achievement: notificationAchievementController} = rpcServices.WEBSOCKET_NOTIFICATION_SERVICE.controllers;
const {achievement: achievementRPCController, userAchievement: userAchievementRPCController} = rpcServices.PROGRESS_SERVICE.controllers;
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const stream = require('stream');
const {adminValidate} = require('../helpers/auth');
const {decodeToken} = require('../helpers/auth');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    if (!req.token) return res.redirect('/user/login');

    const channel = await getChannel();
    const {userId} = await decodeToken(req.token);
    let {result: achievements} = await progressServiceRPC[userAchievementRPCController](channel,
        'getByUsername', {username: userId});
    if (!achievements) achievements = [];
    let {result: newAchievementsIds} = await websocketNotificationService[notificationAchievementController](channel,
        'getNewUserAchievementsIdsByUserId', {userId});
    achievements.forEach(ach => {
        if (newAchievementsIds.some(id => id === ach._id)) ach.new = true;
    });
    await websocketNotificationService[notificationAchievementController](channel,
        'readByUserId', {userId});
    res.render('achievements.hbs', {
        layout: 'empty.hbs',
        isAuth: true,
        achievements,
        choosenAchievement: achievements[0],
    });
}));

router.get('/many', adminValidate, asyncHandler(async (req, res) => {
    const sort = req.query.sortField
        ? {[req.query.sortField]: req.query.sortByOrder ? +req.query.sortByOrder : 1}
        : {name: 1};
    const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
        'getManyAchievements', {
            achievementForFind: {
                _id: req.query._id,
                name: req.query.name,
                fileId: req.query.fileId,
                description: req.query.description,
                previewFileId: req.query.previewFileId,
            },
            count: req.query.count ? +req.query.count : undefined,
            skip: req.query.skip ? +req.query.skip : undefined,
            sort,
        });
    if (answer.error) res.status(500);
    res.json(answer);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const {result, error} = await progressServiceRPC[achievementRPCController](await getChannel(),
        'getAchievement', {id: req.params.id});
    if (error) return res.status(500).send('Internal Server Error');
    res.json(result);
}));

router.post('/', adminValidate, upload.fields([{name: 'achievementImg'}, {name: 'previewImg'}]),
    asyncHandler(async (req, res) => {
        const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
            'create', {
                conditions: JSON.parse(req.body.conditions),
                file: req.files.achievementImg[0],
                description: req.body.description,
                name: req.body.name,
                previewFile: req.files.previewImg[0],
            });
        if (answer.error) res.status(500);
        res.json(answer);
    }));

router.put('/:id', adminValidate, asyncHandler(async (req, res) => {
    const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
        'updateAchievementById', {
            id: req.params.id,
            name: req.body.name,
            description: req.body.description,
            conditions: JSON.parse(req.body.conditions),
        });
    if (answer.error) res.status(500);
    res.json(answer);
}));

router.get('/file/:id', asyncHandler(async (req, res) => {
    const {result: file} = await progressServiceRPC[achievementRPCController](await getChannel(),
        'getAchievementFile', {id: req.params.id});
    if (!file || !file.buffer)
        return res.status(500).send('Internal Server Error');

    res.set('Content-Type', file.contentType);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(file.buffer));
    bufferStream.pipe(res);
}));

router.put('/file/:id', adminValidate, upload.single('achievementImg'),
    asyncHandler(async (req, res) => {
        const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
            'updateAchievementFile', {file: req.file, fileId: req.params.id});
        if (answer.error) res.status(500);
        res.json(answer);
    }));

router.delete('/file/:fileId', adminValidate, asyncHandler(async (req, res) => {
    const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
        'deleteFileById', {id: req.params.fileId});
    if (answer.error) res.status(500);
    res.json(answer);
}));

router.delete('/:id', adminValidate, asyncHandler(async (req, res) => {
    const answer = await progressServiceRPC[achievementRPCController](await getChannel(),
        'deleteAchievementById', {id: req.params.id});
    if (answer.error) res.status(500);
    res.json(answer);
}));

module.exports = router;