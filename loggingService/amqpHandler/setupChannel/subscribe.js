const {bufferToObj} = require('../../helpers/objBufferMapper');
const {isFileExist} = require('../../helpers/isFileExist');

async function subscribe(channel, subExchange, handler) {
    channel.assertExchange(subExchange, 'fanout', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(q.queue, subExchange, '');
    channel.consume(q.queue, (msg) => handler(bufferToObj(msg.content)), {
        noAck: true,
    });
}

module.exports = {
    setup: async function (channel) {
        if(!isFileExist(__dirname+'/../../subscribers'))return;
        const subscribers = require('../../subscribers');
        for (let subscriber of subscribers)
            await subscribe(channel, subscriber.subExchange, subscriber.method);
    }
};