const {getChannel} = require('../amqpHandler');
const {subExchanges} = require('../options');
const {bufferToObj} = require('../helpers/objBufferMapper');
const emailService = require('../services/emailService');

module.exports = async function () {
    const channel = await getChannel();
    channel.assertExchange(subExchanges.email, 'fanout', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(q.queue, subExchanges.email, '');
    channel.consume(q.queue, msg => subscribe(bufferToObj(msg.content)), {noAck: true});
};

async function subscribe(content) {
    try {
        if (content.block) {
            await emailService.sendBlockMail(content);
        } else {
            await emailService.sendUnblockMail(content);
        }
    } catch (e) {
        console.log(e);  //todo add logs
    }
}