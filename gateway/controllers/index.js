const themeCommonController = require('./themeController');
const exerciseController = require('./exerciseController');
const achievementController = require('./achievementController');
const userController = require('./userController');
const log = require('./logController');
const {authValidate} = require('../helpers/auth');

module.exports = function (app) {
    app.use('/theme', authValidate, themeCommonController);
    app.use('/exercises', authValidate, exerciseController);
    app.use('/achievement', authValidate, achievementController);
    app.use('/user', authValidate, userController);
    app.use('/log', authValidate, log);
};