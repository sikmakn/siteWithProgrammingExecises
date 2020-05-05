const pathToConf = process.env.NODE_ENV === 'production' ? './config.prod' : './config.dev';
module.exports = require(pathToConf);