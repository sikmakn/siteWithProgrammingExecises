const themeCommonController = require('./themeController');
const exerciseController = require('./exerciseController');
const achievementController = require('./achievementController');
const userController = require('./userController');

module.exports = function (app) {
    app.use('/theme', themeCommonController);
    app.use('/exercises', exerciseController);
    app.use('/achievement', achievementController);
    app.use('/user', userController);
};