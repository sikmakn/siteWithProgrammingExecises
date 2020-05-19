const languages = ['js', 'python', 'net'];

const langOptions = {
    'js': {
        readLine: `fs=require('fs');
            let params = fs.readFileSync('/dev/stdin')
                .toString().split("\\n");
             let countForPrompt = 0;
            const prompt = ()=> params[countForPrompt++];`,
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
    answers: {
        success: 3,
        wrong: 4,
    },
    values: {
        success: 'correct',
        wrong: 'incorrect',
        error: 'error'
    }
};

module.exports = {
    languages,
    langOptions,
    mongoOptions,
    rpcServiceName: 'webServiceTestQ',
    mongooseUpdateParams,
    compilerOptions,
};