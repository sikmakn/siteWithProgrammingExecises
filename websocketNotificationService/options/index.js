const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true, upsert: true};

module.exports = {
    mongooseUpdateParams,
    mongoOptions,
    replyRPCQueueName: 'webSocketReply',
};