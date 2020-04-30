const themeCommonController = require("./themeController");
const exerciseController = require("./exerciseController");

module.exports = function (app) {
    app.use('/theme', themeCommonController());
    app.use('/exercises', exerciseController());
};