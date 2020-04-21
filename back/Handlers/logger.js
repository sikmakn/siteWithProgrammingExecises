const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-daily-rotate-file');
const {loggerOptions} = require('../options/options');

const transport = new (winston.transports.DailyRotateFile)(loggerOptions);

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