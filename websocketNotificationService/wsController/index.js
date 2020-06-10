const WebSocket = require('ws');
const {PORT} = require('../config');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {addToGroup, deleteByElementId} = require('../connectionMap');
const {getToken} = require('../helpers/getToken');
const newUserAchievementsService = require('../services/newUserAchievementsService');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

const wss = new WebSocket.Server({port: PORT});

wss.on('connection', async function connection(ws, req) {
    try {
        let wsId = uuid();
        const token = getToken(req.headers.cookie);
        if (!token) return;
        const {userId} = jwt.decode(token);
        addToGroup({userId, wsId, ws});

        const count = await newUserAchievementsService.getCount({userId});
        if (count) ws.send(count);

        ws.on('close', async () => {
            try {
                deleteByElementId({userId, wsId});
            } catch (error) {
                await publish(await getChannel(), pubExchanges.error,
                    {error: serializeError(error), date: Date.now(), serviceName});
            }
        });

    } catch (error) {
        await publish(await getChannel(), pubExchanges.error,
            {error: serializeError(error), date: Date.now(), serviceName});
    }
});

module.exports = {wss};