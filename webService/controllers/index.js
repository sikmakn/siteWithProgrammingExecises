const themeCommonController = require("./themesCommonController");
const exerciseController = require("./exerciseController");
const {languages} = require('../options');

function setUpLang(app, lang) {
    app.use(`/${lang}`, themeCommonController(lang));
    app.use(`/${lang}/exercises`, exerciseController(lang));
}

module.exports = function (app) {
    languages.forEach(lang => setUpLang(app, lang));
};