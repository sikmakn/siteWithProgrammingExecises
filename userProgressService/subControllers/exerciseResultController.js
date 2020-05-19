const {getChannel} = require('../amqpHandler');
const {subExchanges} = require('../options');
const exerciseResultService = require('../services/exerciseResultService');
const userAchievementService = require('../services/userAchievementService');
const {bufferToObj} = require('../helpers/objBufferMapper');

module.exports = async function () {
    const channel = await getChannel();
    channel.assertExchange(subExchanges.exerciseTests, 'fanout', {durable: false});
    const q = await channel.assertQueue('', {exclusive: true});
    channel.bindQueue(q.queue, subExchanges.exerciseTests, '');
    channel.consume(q.queue, msg => subscribe(bufferToObj(msg.content)), {noAck: true});
};

async function subscribe(content) {
    const {username, difficulty, themeId, exerciseId, sourceCode, results} = content;
    await exerciseResultService.findOneAndUpdate({
        findParams: {username, themeId, exerciseId},
        updatedExercise: {username, difficulty, themeId, exerciseId, sourceCode},
        results,
    });
    await userAchievementService.addByUsername(username);
}