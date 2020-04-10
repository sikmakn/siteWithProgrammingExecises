const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
    filename: './log/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const errorLogger = expressWinston.errorLogger({
    transports: [
        transport
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
});
module.exports = {
    errorLogger
};