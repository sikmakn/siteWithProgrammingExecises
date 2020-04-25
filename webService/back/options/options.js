const loggerOptions = {
    filename: './log/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
};

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

module.exports = {
    loggerOptions,
    languages,
    langOptions,
    mongoOptions,
    PORT: process.env.PORT || 3000,
};