const express = require("express");
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');

module.exports = function themeCommonController(lang) {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const themes = await themeService.findThemes({language: lang});
            const resObj = {
                layout: 'themeSelectMain.hbs',
                themesList: themes.map(th => themeMapper.fromThemeToOutObj(th)),
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
            const newTheme = themeMapper.fromObjToThemeObj(req.body);
            await themeService.create(newTheme);
            res.render('empty.hbs');
        } catch (e) {
            console.error(e);
        }
    });

    return router;
};
