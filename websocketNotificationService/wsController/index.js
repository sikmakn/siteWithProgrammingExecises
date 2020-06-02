const WebSocket = require('ws');
const {PORT} = require('../config');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {addToGroup, deleteByElementId} = require('../connectionMap');
const {getToken} = require('../helpers/getToken');
const newUserAchievementsService = require('../services/newUserAchievementsService');

const wss = new WebSocket.Server({port: PORT});

wss.on('connection', async function connection(ws, req) {
    let wsId = uuid();

    const token = getToken(req.headers.cookie);
    if (!token) return;
    const {userId} = jwt.decode(token);
    addToGroup({userId, wsId, ws});

    const count = await newUserAchievementsService.getCount({userId});
    if (count) ws.send(count);

    ws.on('message', async () => await newUserAchievementsService.readNotification({userId}));
    ws.on('close', () => deleteByElementId({userId, wsId}))
});

module.exports = {wss};