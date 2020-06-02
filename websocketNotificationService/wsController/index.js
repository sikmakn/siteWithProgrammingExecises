const WebSocket = require('ws');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {addToGroup} = require('../helpers/connectionMap');
const {getToken} = require('../helpers/getToken');

const connections = new Map();

const wss = new WebSocket.Server({port: 3002});

wss.on('connection', function connection(ws, req) {
    let wsId = uuid();

    const token = getToken(req.headers.cookie);
    if (!token) return;
    const {userId} = jwt.decode(token);
    addToGroup({map: connections, groupId: userId, elementId: wsId, element: ws});

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.on('close', () => connections.delete(req.headers.cookie))
    //  ws.send('something');
});

module.exports = {wss};