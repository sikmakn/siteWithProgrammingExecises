const languages = ['js', 'python', 'net'];

const langOptions = {
    'js': {
        readLine: `const prompt = (function (){
                                        const fs=require('fs');
                                        const params = fs.readFileSync('/dev/stdin').toString().split("\\n");
                                        let countForPrompt = 0;
                                        return () => params[countForPrompt++];
                })();`,
        languageId: 63,
    },
};

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
};

const mongooseUpdateParams = {new: true, omitUndefined: true};

const compilerOptions = {
    3: 'correct',
    4: 'incorrect',
    default: 'error',
};

const pubExchanges = {error: 'error'};

module.exports = {
    languages,
    langOptions,
    mongoOptions,
    rpcServiceName: 'webServiceQ',
    serviceName: 'userService',
    pubExchanges,
    mongooseUpdateParams,
    compilerOptions,
    replyRPCQueueName: 'webService',
};