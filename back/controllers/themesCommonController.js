const express = require("express");
const themeService = require('../services/themeService');

module.exports = function themeCommonController(lang) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            console.log(lang);
            const themes = await themeService.findThemes({language: lang});
            const resObj = {
                layout: 'themeSelectMain.hbs',
                themesList: themes,
                lang,
            };
            const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
            resObj[flagName] = true;

            res.render('themesList.hbs', resObj);
        } catch (err) {
            console.error(err);
        }
    });

    router.post('/', async (req, res) => {
        try {
            const newTheme = {
                name: req.fields.name,
                language: req.fields.language,
            };
            if (req.fields.number !== 0) newTheme.number = req.fields.number;

            await themeService.create(newTheme);

            res.render('empty.hbs');
        } catch (e) {
            console.error(e);
        }
    });

    return router;
};
